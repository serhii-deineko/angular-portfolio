import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { ExperienceComponent } from "../experience/experience.component";
import { HeroComponent } from "../hero/hero.component";
import { ProjectsComponent } from "../projects/projects.component";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [CommonModule, HeroComponent, ProjectsComponent, ExperienceComponent],
	template: `
		<main>
			<section id="hero" aria-label="About Section">
				<app-hero></app-hero>
			</section>

			<section id="projects" aria-label="Featured Projects">
				<app-projects></app-projects>
			</section>

			<section id="experience" aria-label="Professional Experience">
				<app-experience></app-experience>
			</section>
		</main>
	`,
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent {}
