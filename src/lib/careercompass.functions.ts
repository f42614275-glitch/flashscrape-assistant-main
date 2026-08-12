import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { CareerResultSchema, CollegeResultSchema, QuestionsSchema } from "./careercompass.schemas";
import { FAST_MODEL, MAIN_MODEL, generateJson, insertRow } from "./careercompass.server";
import {
  firecrawlScrapeMany,
  firecrawlSearchMany,
  formatFindings,
  rankFindings,
} from "./firecrawl.server";
import {
  CAREER_SYSTEM_PROMPT,
  COLLEGE_SYSTEM_PROMPT,
  QUESTION_SYSTEM_PROMPT,
  buildCareerPrompt,
  buildCollegePrompt,
  buildQuestionPrompt,
} from "./prompts.server";

const GenerateQuestionsInput = z.object({
  interests: z.array(z.string().min(1)).min(1).max(8),
  numQuestions: z.number().int().min(8).max(14).default(12),
});

export const generateQuestions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateQuestionsInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await generateJson<unknown>({
      model: FAST_MODEL,
      system: QUESTION_SYSTEM_PROMPT,
      prompt: buildQuestionPrompt(data.interests, data.numQuestions),
      temperature: 0.8,
    });
    const questions = QuestionsSchema.parse(raw);

    const quizSessionId = await insertRow("quiz_sessions", {
      interests: data.interests,
      questions,
    });

    return { quizSessionId, questions };
  });

const AnalyzeCareerInput = z.object({
  quizSessionId: z.string().nullable().optional(),
  interests: z.array(z.string().min(1)).min(1),
  city: z.string().min(1).max(80),
  answers: z.array(z.object({ q: z.string(), a: z.string() })).min(4),
});

export const analyzeCareer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeCareerInput.parse(input))
  .handler(async ({ data }) => {
    const year = new Date().getFullYear();
    const searchFindings = await firecrawlSearchMany(
      [
        `best career options in India ${year} for students interested in ${data.interests.join(", ")}`,
        `average salary India ${year} entry level ${data.interests[0]} careers LPA site:ambitionbox.com`,
        `${data.interests[0]} salary in India freshers ${year} glassdoor OR payscale LPA`,
        `India job market demand ${year} ${data.interests.join(" ")} hiring outlook report`,
        `top colleges in ${data.city} for ${data.interests.join(" ")} courses admission ${year}`,
        `entrance exams ${year} India for ${data.interests.join(", ")} courses after 12th`,
      ],
      4,
    );
    const findings = [
      ...searchFindings,
      ...(await firecrawlScrapeMany(
        rankFindings(searchFindings)
          .slice(0, 2)
          .map((f) => f.url),
        4000,
      )),
    ];

    const transcript = data.answers.map((a, i) => `Q${i + 1}: ${a.q}\nA: ${a.a}`).join("\n\n");

    const raw = await generateJson<unknown>({
      model: MAIN_MODEL,
      system: CAREER_SYSTEM_PROMPT,
      prompt: buildCareerPrompt({
        interests: data.interests,
        city: data.city,
        transcript,
        research: formatFindings(findings),
      }),
      temperature: 0.25,
    });
    const result = CareerResultSchema.parse(raw);

    if (data.quizSessionId) {
      await insertRow("career_results", {
        quiz_session_id: data.quizSessionId,
        result_json: result,
      });
    }

    return result;
  });

const AnalyzeCollegeInput = z.object({
  collegeName: z.string().min(2).max(160),
  stream: z.string().min(2).max(120),
  board: z.string().min(2).max(60),
  boardPercentage: z.string().min(1).max(20),
  examScore: z.string().max(60).optional().default(""),
  category: z.string().min(2).max(20).default("General"),
  cityState: z.string().min(2).max(120),
  targetYear: z.string().min(4).max(4),
});

export const analyzeCollege = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeCollegeInput.parse(input))
  .handler(async ({ data }) => {
    const c = data.collegeName;
    const searchFindings = await firecrawlSearchMany(
      [
        `${c} ${data.stream} cutoff ${data.targetYear} and ${Number(data.targetYear) - 1}`,
        `${c} ${data.stream} ${data.category} category cutoff percentile last year`,
        `site:reddit.com ${c} admission cutoff experience ${data.stream}`,
        `site:quora.com ${c} ${data.stream} admission chances worth it`,
        `${c} official admission criteria eligibility ${data.targetYear} site:.ac.in OR site:.edu.in`,
        `site:careers360.com ${c} ${data.stream} cutoff placement`,
        `site:shiksha.com ${c} ${data.stream} cutoff fees placement`,
        `${c} placement report median package NIRF ranking ${data.targetYear}`,
        `${c} review students hostel campus honest ${data.targetYear}`,
      ],
      4,
    );
    const findings = [
      ...searchFindings,
      ...(await firecrawlScrapeMany(
        rankFindings(searchFindings)
          .slice(0, 3)
          .map((f) => f.url),
        6000,
      )),
    ];

    const todaysDate = new Date().toISOString().slice(0, 10);

    const raw = await generateJson<unknown>({
      model: MAIN_MODEL,
      system: COLLEGE_SYSTEM_PROMPT,
      prompt: buildCollegePrompt({
        collegeName: data.collegeName,
        stream: data.stream,
        board: data.board,
        boardPercentage: data.boardPercentage,
        examScore: data.examScore,
        category: data.category,
        cityState: data.cityState,
        targetYear: data.targetYear,
        todaysDate,
        research: formatFindings(findings),
      }),
      temperature: 0.15,
    });
    const result = CollegeResultSchema.parse(raw);

    const cachedUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
    await insertRow("college_queries", {
      college_name: data.collegeName,
      stream: data.stream,
      category: data.category,
      board_percentage: data.boardPercentage,
      result_json: result,
      research_confidence: result.research_confidence,
      cached_until: cachedUntil,
    });

    return result;
  });

const ReportInput = z.object({
  resultType: z.enum(["career", "college"]),
  reportedIssue: z.string().min(3).max(1000),
});

export const reportInaccuracy = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ReportInput.parse(input))
  .handler(async ({ data }) => {
    await insertRow("accuracy_reports", {
      result_type: data.resultType,
      reported_issue: data.reportedIssue,
    });
    return { ok: true };
  });