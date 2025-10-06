/* Angular */
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

/* Environment */
import { Environment } from "../../../../environments/environment";

/* Components */
import { ResultComponent } from "../result/result.component";
import { SceletComponent } from "../scelet/scelet.component";

/* Interfaces */
import { EmojiInterface, ResponseInterface } from "../../interfaces/emoji.interface";

/* OpenAI */
import { OpenAI } from "openai";
import { PromptUtility } from "../../utilities/prompt.utility";

/* JSON */
import EmojiJSON from "../../assets/cleaned-emoji.json";

@Component({
	standalone: true,
	selector: "app-search",
	imports: [CommonModule, FormsModule, ResultComponent, SceletComponent],
	templateUrl: "./search.component.html",
	styleUrl: "./search.component.scss"
})
export class SearchComponent {
	openai: OpenAI = new OpenAI({
		apiKey: Environment.OPENAI_API,
		dangerouslyAllowBrowser: true
	});
	emojisJson: Array<EmojiInterface> = EmojiJSON;
	resultArray: Array<ResponseInterface> = [];
	searchPrompt: string = "";
	searchTimeout: any;
	previousPrompt: string = "";
	searchTimeoutId: any;

	private abortController?: AbortController;

	async onInput(prompt: string) {
		const trimmedPrompt = prompt.trim();

		clearTimeout(this.searchTimeout);
		clearTimeout(this.searchTimeoutId);

		if (this.abortController) {
			this.abortController.abort();
			this.abortController = undefined;
		}

		if (trimmedPrompt.length < 1) {
			this.resultArray = [];
			this.previousPrompt = "";
			return;
		}

		if (trimmedPrompt !== this.previousPrompt) {
			this.searchTimeout = setTimeout(() => {
				const currentTrimmed = this.searchPrompt.trim();
				if (trimmedPrompt === currentTrimmed && trimmedPrompt.length >= 1) {
					this.previousPrompt = trimmedPrompt;
					this.resultArray = [];
					this.searchEmojis(trimmedPrompt);
				}
			}, 500);
		}
	}

	async searchEmojis(prompt: string, showmore: boolean = false, attempts: number = 0) {
		const timeoutDuration = 15000 + attempts * 5000;
		this.searchTimeoutId = setTimeout(() => {
			if (this.abortController) {
				this.abortController.abort();
			}
			if (prompt === this.searchPrompt.trim()) {
				this.resultArray = [];
			}
		}, timeoutDuration);

		while (attempts <= 10) {
			this.abortController = new AbortController();
			let response: ResponseInterface[] = [];

			try {
				if (prompt !== this.searchPrompt.trim()) {
					return;
				}

				const request = await this.openai.chat.completions.create(
					PromptUtility(prompt, showmore, this.resultArray),
					{ signal: this.abortController.signal }
				);

				if (!request.choices?.[0]?.message?.content) {
					throw new Error("Empty response from OpenAI");
				}

				const content = request.choices[0].message.content;
				let parsedContent;

				try {
					parsedContent = JSON.parse(content);
				} catch (parseError) {
					throw new Error(`Invalid JSON response: ${content}`);
				}

				if (!parsedContent.result || !Array.isArray(parsedContent.result)) {
					throw new Error("Invalid response format");
				}

				// Check if result array is empty
				if (parsedContent.result.length === 0) {
					throw new Error("Empty result array from OpenAI");
				}

				// prettier-ignore
				response = parsedContent.result.map((unicode: string) => {
					return this.emojisJson.find((emoji) => {
						return emoji.unicode.includes(unicode);
					});
				}).filter(Boolean);

				// If no valid emojis found, treat as error and retry
				if (response.length === 0) {
					throw new Error("No valid emojis found in response");
				}

				if (prompt === this.searchPrompt.trim()) {
					this.resultArray = [...new Set(response)];
				}

				clearTimeout(this.searchTimeoutId);
				return;
			} catch (error: any) {
				if (error.name === "AbortError") {
					clearTimeout(this.searchTimeoutId);
					return;
				}

				attempts++;

				if (attempts >= 10) {
					if (prompt === this.searchPrompt.trim()) {
						this.resultArray = [];
					}
					clearTimeout(this.searchTimeoutId);
					return;
				}

				// Wait before retry with exponential backoff
				await new Promise((resolve) => setTimeout(resolve, 100 * attempts));
			}
		}
	}

	updateHeight() {
		if (this.resultArray.length > 0) {
			return `${this.resultArray.length * 4 + 0.25}rem`;
		} else if (this.searchPrompt.length > 0) {
			return "20.25rem";
		} else {
			return "0rem";
		}
	}

	updateTooltip() {
		// if (this.target) {
		// 	let rect = this.target.el.getBoundingClientRect();
		// 	this.target.top = `${rect.top - rect.height}px`;
		// 	this.target.left = `${rect.left + rect.width / 2}px`;
		// }
	}
}
