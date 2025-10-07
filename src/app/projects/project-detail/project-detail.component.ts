import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { switchMap } from "rxjs/operators";
import { PROJECTS_DEFINITIONS } from "src/app/shared/constants/projects.constant";
import { CtaButtonComponent } from "../../shared/components/cta-button/cta-button.component";

interface ProjectDetails {
	id: string;
	title?: string;
	description?: string;
	"key-points"?: string[];
	"full-description"?: string;
	sections?: { [key: string]: { title: string; content: string } };
}

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
	projectDetails = signal<ProjectDetails>({ id: "" });
	projectId = signal<string>("");

	selectedImage?: number;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService
	) {}

	ngOnInit() {
		this.route.paramMap
			.pipe(
				switchMap((params) => {
					this.projectId.set(params.get("id")!);
					return this.translate.get("projects.items").pipe(
						switchMap((items: any) => {
							return Promise.resolve(
								items.find((project: any) => {
									return project.id === this.projectId();
								})
							);
						})
					);
				})
			)
			.subscribe((projectData) => {
				if (!projectData) {
					this.router.navigate(["/"]);
					return;
				}

				this.projectDetails.set({
					id: this.projectId(),
					title: projectData.title,
					description: projectData.description,
					"key-points": projectData["key-points"],
					"full-description": projectData["full-description"],
					sections: projectData.sections
				});

				setTimeout(() => {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}, 0);
			});
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
