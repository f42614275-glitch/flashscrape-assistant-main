import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.number(),
  dimension: z.string(),
  q: z.string(),
  opts: z.array(z.string()).min(2),
});
export const QuestionsSchema = z.array(QuestionSchema).min(4);
export type Question = z.infer<typeof QuestionSchema>;

export const CareerResultSchema = z.object({
  personality_summary: z.string(),
  confidence_note: z.string(),
  top_careers: z
    .array(
      z.object({
        title: z.string(),
        is_primary: z.boolean().optional().default(false),
        why_fit: z.string(),
        avg_salary_entry: z.string(),
        avg_salary_mid_career: z.string(),
        job_market_outlook: z.string(),
        top_entrance_exams: z.array(z.string()).default([]),
        colleges_near_city: z
          .array(
            z.object({
              name: z.string(),
              tier: z.string().optional().default(""),
              course: z.string().optional().default(""),
              approx_fees_per_year: z.string().optional().default(""),
            }),
          )
          .default([]),
        first_steps: z.array(z.string()).default([]),
      }),
    )
    .min(1),
  data_freshness_warning: z.string(),
});
export type CareerResult = z.infer<typeof CareerResultSchema>;

const PhaseSchema = z.object({
  timeframe: z.string(),
  actions: z.array(z.string()).default([]),
});

export const CollegeResultSchema = z.object({
  research_confidence: z.string(),
  sources_checked: z.array(z.string()).default([]),
  gap_analysis: z.object({
    your_percentage: z.string(),
    official_cutoff: z.string(),
    realistic_cutoff_per_students: z.string(),
    category_note: z.string().optional().default(""),
    gap_verdict: z.string(),
    honest_paragraph: z.string(),
  }),
  college_reality_check: z.object({
    reputation_vs_reality: z.string(),
    placement_reality: z.string(),
    campus_life_from_students: z.string(),
  }),
  personalized_roadmap: z.object({
    months_available: z.string(),
    phase_1_immediate: PhaseSchema,
    phase_2_near_term: PhaseSchema,
    phase_3_application_prep: PhaseSchema,
    phase_4_final_stretch: PhaseSchema,
  }),
  entrance_exam_strategy: z.object({
    primary_exam: z.string(),
    score_this_college_needs: z.string(),
    your_current_readiness: z.string(),
    prep_recommendation: z.string(),
  }),
  free_certifications: z
    .array(
      z.object({
        name: z.string(),
        platform: z.string(),
        relevance_to_this_college: z.string(),
        search_term_to_find_it: z.string().optional().default(""),
        time_commitment: z.string().optional().default(""),
      }),
    )
    .default([]),
  backup_colleges: z
    .array(
      z.object({
        name: z.string(),
        why_strong_backup: z.string(),
        estimated_cutoff_for_you: z.string().optional().default(""),
        honest_comparison: z.string().optional().default(""),
      }),
    )
    .default([]),
  insider_tips: z.array(z.string()).default([]),
  honest_warning: z.string(),
  data_freshness_note: z.string(),
});
export type CollegeResult = z.infer<typeof CollegeResultSchema>;