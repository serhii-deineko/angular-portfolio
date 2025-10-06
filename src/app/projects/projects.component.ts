import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PROJECTS_DEFINITIONS } from "../shared/constants/projects.constant";

@Component({
	selector: "app-projects",
	standalone: true,
	imports: [CommonModule, MatIconModule, TranslateModule],
	templateUrl: "./projects.component.html",
	styleUrls: ["./projects.component.scss"],
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
export class ProjectsComponent {
	constructor(private router: Router) {}

	getProjectDefinition(projectId: string) {
		return PROJECTS_DEFINITIONS[projectId] || {};
	}

	navigateToProject(projectId: string) {
		this.router.navigate(["/projects", projectId]);
	}
}
