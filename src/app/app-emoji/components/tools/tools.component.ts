/* Angular */
import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	standalone: true,
	selector: "tool",
	imports: [CommonModule],
	templateUrl: "./tools.component.html",
	styleUrl: "./tools.component.scss"
})
export class ToolsComponent {
	@Input() tool = "";
}
