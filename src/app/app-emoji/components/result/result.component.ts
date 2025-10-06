/* Angular */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";

/* Components */
import { ToolsComponent } from "../tools/tools.component";

/* Interfaces */
import { EmojiInterface } from "../../interfaces/emoji.interface";

/* Services */
import { ModalService } from "../../services/modal.service";
import { TooltipService } from "../../services/tooltip.service";
import { DownloadService } from "../../services/download.service";

/* Pipes */
import { UrlPipe } from "../../pipes/url.pipe";

@Component({
	standalone: true,
	selector: "result",
	imports: [CommonModule, ToolsComponent, UrlPipe],
	templateUrl: "./result.component.html",
	styleUrl: "./result.component.scss"
})
export class ResultComponent {
	@Input() emoji!: EmojiInterface;
	@Output() event: EventEmitter<any> = new EventEmitter<any>();

	mouseenter: boolean;
	downloading: boolean;
	trigger!: HTMLElement;
	tools: string[];

	constructor(
		private clipboard: Clipboard,
		private modalService: ModalService,
		private tooltipService: TooltipService,
		private downloadService: DownloadService
	) {
		this.mouseenter = false;
		this.downloading = false;
		this.tools = ["Code", "Download", "Copy"];
	}

	onMouseEnter(event: MouseEvent, tooltip: string) {
		if (this.downloading) return;

		const target = event.target as HTMLElement;
		if (target && target !== this.trigger) {
			this.trigger = target;
			this.tooltipService.showTooltip(this.trigger, tooltip);
		}
	}

	onMouseLeave() {
		if (this.downloading) {
			return;
		}

		this.tooltipService.hideTooltip();
	}

	async onMouseClick(action: string) {
		if (this.emoji?.icon) {
			switch (action) {
				case "Code": {
					const urlPipe = new UrlPipe();
					const imageUrl = urlPipe.transform(this.emoji.unicode, "png");
					const codeSnippet = `<img src="https://serhii-deineko.web.app/${imageUrl}" alt="${this.emoji.description}" />`;
					this.clipboard.copy(codeSnippet);
					this.tooltipService.showTooltip(this.trigger, "Code copied");
					break;
				}
				case "Download": {
					this.downloading = true;
					this.tooltipService.showTooltip(this.trigger, "Downloading");

					if (this.emoji?.animation) {
						await this.downloadService.downloadZip(this.emoji);
					} else {
						await this.downloadService.downloadImg(this.emoji);
					}

					this.tooltipService.showTooltip(this.trigger, "Emoji downloaded");

					setTimeout(() => {
						this.downloading = false;
						this.tooltipService.hideTooltip();
					}, 1500);
					break;
				}
				case "Copy": {
					this.clipboard.copy(this.emoji.icon);
					this.tooltipService.showTooltip(this.trigger, "Emoji copied");
					break;
				}
			}
		}
	}
}
