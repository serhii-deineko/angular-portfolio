import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface StructuredData {
	"@context": string;
	"@type": string;
	[key: string]: any;
}

@Component({
	selector: "app-structured-data",
	standalone: true,
	imports: [CommonModule],
	template: `
		<script type="application/ld+json" [innerHTML]="jsonLd"></script>
	`
})
export class StructuredDataComponent implements OnInit {
	@Input() data!: StructuredData;

	jsonLd: string = "";

	ngOnInit() {
		this.jsonLd = JSON.stringify(this.data, null, 2);
	}
}
