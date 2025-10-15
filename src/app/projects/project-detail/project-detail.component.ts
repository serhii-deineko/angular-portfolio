import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { PROJECTS_DEFINITIONS } from "src/app/shared/constants/projects.constant";
import { CtaButtonComponent } from "../../shared/components/cta-button/cta-button.component";

@Component({
	selector: "app-project-detail",
	standalone: true,
	imports: [CommonModule, CtaButtonComponent, TranslateModule],
	templateUrl: "./project-detail.component.html",
	styleUrls: ["./project-detail.component.scss"]
})
export class ProjectDetailComponent implements OnInit {
	projectDefinition = computed(() => {
		return PROJECTS_DEFINITIONS[this.projectId()];
	});
	projectId = signal<string>("");
	selectedImage?: number;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			const id = params.get("id");
			if (!id) {
				this.router.navigate(["/"]);
				return;
			}
			this.projectId.set(id);

			setTimeout(() => {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}, 0);
		});
	}

	getCurrentProject() {
		const projects = this.translate.instant("projects.items") as any[];
		return projects.find((project) => project.id === this.projectId());
	}

	openFullscreen(image: number) {
		this.selectedImage = image;
		document.body.style.overflow = "hidden";
	}

	closeFullscreen() {
		this.selectedImage = undefined;
		document.body.style.overflow = "auto";
	}
}
