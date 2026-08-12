import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { E as isRedirect, g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-ey4Ql8m12.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn } from "./button-COGY-sf9.mjs";
import { Ct as string, bt as number, ct as _enum, ft as array, xt as object } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/careercompass.functions-BDX9WomY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var GenerateQuestionsInput = object({
	interests: array(string().min(1)).min(1).max(8),
	numQuestions: number().int().min(8).max(14).default(12)
});
var generateQuestions = createServerFn({ method: "POST" }).inputValidator((input) => GenerateQuestionsInput.parse(input)).handler(createSsrRpc("e0e98e52c3b50e18dcdfe0694b2b20ecd3734e03574803bb2d088aed339e417c"));
var AnalyzeCareerInput = object({
	quizSessionId: string().nullable().optional(),
	interests: array(string().min(1)).min(1),
	city: string().min(1).max(80),
	answers: array(object({
		q: string(),
		a: string()
	})).min(4)
});
var analyzeCareer = createServerFn({ method: "POST" }).inputValidator((input) => AnalyzeCareerInput.parse(input)).handler(createSsrRpc("78be9b0fdcbf9361fb6335f4faaeb4cb625f9e21fe80d8a73bb23303f5ff2c82"));
var AnalyzeCollegeInput = object({
	collegeName: string().min(2).max(160),
	stream: string().min(2).max(120),
	board: string().min(2).max(60),
	boardPercentage: string().min(1).max(20),
	examScore: string().max(60).optional().default(""),
	category: string().min(2).max(20).default("General"),
	cityState: string().min(2).max(120),
	targetYear: string().min(4).max(4)
});
var analyzeCollege = createServerFn({ method: "POST" }).inputValidator((input) => AnalyzeCollegeInput.parse(input)).handler(createSsrRpc("6b2e61dd565fd5251abae1a9741ce2fcd7f30e35838a1fab62e71d110f107711"));
var ReportInput = object({
	resultType: _enum(["career", "college"]),
	reportedIssue: string().min(3).max(1e3)
});
createServerFn({ method: "POST" }).inputValidator((input) => ReportInput.parse(input)).handler(createSsrRpc("e850f7695cb6baab8ecb22cae7882b99ed37956cb24efd1f52c9adfebb10745e"));
//#endregion
export { generateQuestions as a, analyzeCollege as i, Label as n, useServerFn as o, analyzeCareer as r, Input as t };
