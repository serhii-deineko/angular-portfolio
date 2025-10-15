import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import OpenAI from "openai";

const openaiApiKey = defineString("OPENAI_API_KEY");

export const chatCompletion = functions.https.onRequest(async (req, res) => {
	const openai = new OpenAI({
		apiKey: openaiApiKey.value()
	});
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.status(204).send("");
		return;
	}

	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}

	try {
		const { messages, model = "gpt-4o", temperature = 0.7 } = req.body;

		if (!messages || !Array.isArray(messages)) {
			res.status(400).json({ error: "Invalid request body" });
			return;
		}

		const completion = await openai.chat.completions.create({
			model,
			messages,
			temperature,
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
									description:
										"Complete Unicode emoji code-point with all necessary parts (e.g., '31-fe0f-20e3')."
								}
							}
						},
						required: ["result"],
						additionalProperties: false
					}
				}
			}
		});

		res.status(200).json(completion);
	} catch (error: any) {
		console.error("OpenAI API error:", error);
		res.status(500).json({ error: error.message || "Internal server error" });
	}
});
