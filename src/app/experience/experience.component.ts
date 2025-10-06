import { animate, style, transition, trigger } from "@angular/animations";
import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

interface Experience {
	role: string;
	company: string;
	duration: string;
	points: string[];
}

@Component({
	selector: "app-experience",
	standalone: true,
	imports: [TranslateModule],
	templateUrl: "./experience.component.html",
	styleUrls: ["./experience.component.scss"],
	animations: [
		trigger("fadeInUp", [
			transition(":enter", [
				style({ opacity: 0, transform: "translateY(20px)" }),
				animate(
					"600ms cubic-bezier(0.4, 0, 0.2, 1)",
					style({
						opacity: 1,
						transform: "translateY(0)"
					})
				)
			])
		])
	]
})
export class ExperienceComponent {}
