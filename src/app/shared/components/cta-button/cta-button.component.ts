import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-cta-button",
	imports: [MatIconModule, CommonModule],
	templateUrl: "./cta-button.component.html",
	styleUrls: ["./cta-button.component.scss"]
})
export class CtaButtonComponent {
	@Input() fileName: string = "CV — Serhii Deineko.pdf";
	@Input() buttonText: string = "Download CV";
	@Input() targetUrl?: string;
	@Input() fileUrl?: string;
	@Input() buttonIcon?: string;

	constructor(private http: HttpClient) {}

	downloadFile(event: Event): void {
		if (this.targetUrl) {
			return;
		}

		event.preventDefault();

		if (!this.fileUrl) {
			return;
		}

		this.http.get(this.fileUrl, { responseType: "blob" }).subscribe(
			(blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = this.fileName;
				a.click();
				window.URL.revokeObjectURL(url);
			},
			(err) => {
				console.error("Download error", err);
			}
		);
	}
}
