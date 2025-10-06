import { ResponseInterface } from "../interfaces/response.interface";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

export const PromptUtility = (
	prompt: string,
	showmore: boolean,
	result: ResponseInterface[]
): ChatCompletionCreateParamsNonStreaming => {
	return {
		model: "gpt-4o",
		messages: [
			{
				role: "system",
				content: `
					Provide 1 to 7 unique Unicode emoji code-points relevant to the given text, ranked by relevance.
					Follow this JSON format: "result": ["1f3d0", "2764-fe0f", ...up to 7 if it's relevant to text].
					${showmore ? `Exclude any emoji listed in the forbidden codes: [${result.join(", ")}].` : ""}
				`
			},
			{
				role: "assistant",
				content: `
					I will provide the most relevant unique Unicode emoji code-points in the specified JSON format.
					${showmore ? "I will exclude all emoji code-points in the forbidden list from my response." : ""}
				`
			},
			{
				role: "user",
				content: prompt.trim()
			}
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "emoji_code-points",
				strict: true,
				schema: {
					type: "object",
					properties: {
						result: {
							type: "array",
							description:
								"A list of unique Unicode emoji code-points relevant to the given text.",
							items: {
								type: "string",
								description: "Emoji code-point relevant to the given text."
							}
						}
					},
					required: ["result"],
					additionalProperties: false
				}
			}
		}
	};
};
