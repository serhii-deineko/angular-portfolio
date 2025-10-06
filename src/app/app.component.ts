import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { filter, interval, takeWhile } from "rxjs";
import { ContactComponent } from "./contact/contact.component";
import { HeaderComponent } from "./header/header.component";
import { ScrollService } from "./services/scroll.service";
import { LanguageService } from "./shared/services/language.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		CommonModule,
		HeaderComponent,
		RouterOutlet,
		ContactComponent,
		TranslateModule,
		MatProgressSpinnerModule
	],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	animations: [
		trigger("routeAnimations", [
			transition("* <=> *", [
				style({ opacity: 0 }),
				animate("300ms ease-in", style({ opacity: 1 }))
			])
		])
	]
})
export class AppComponent implements OnInit, AfterViewInit {
	title = "Serhii Deineko - Angular Frontend Developer";
	sections = [
		{ id: "hero", name: "Home" },
		{ id: "projects", name: "Projects" },
		{ id: "experience", name: "Experience" },
		{ id: "contact", name: "Contact" }
	];
	activeSection = "";

	progressSpiner = signal<boolean>(true);

	constructor(
		private scrollService: ScrollService,
		private translateService: TranslateService,
		private languageService: LanguageService,
		private router: Router
	) {
		this.languageService.initLanguage();
	}

	ngOnInit() {
		this.scrollService.init(
			this.sections.map((s) => s.id),
			"scrollProgress"
		);

		this.scrollService.activeSection$.subscribe((section) => {
			this.activeSection = section;
		});

		// Update sections when route changes and show progress spinner
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				// Show progress spinner for 1 second during route transitions
				this.progressSpiner.set(true);

				setTimeout(() => {
					this.progressSpiner.set(false);
				}, 1000);

				// Small delay to ensure DOM is updated
				setTimeout(() => {
					// Check if we're on a page with sections (home page)
					if (event.urlAfterRedirects === "/" || event.urlAfterRedirects.includes("#")) {
						this.scrollService.updateSections(this.sections.map((s) => s.id));
					} else {
						// Clear active section for pages without sections (like emoji-seeker)
						this.scrollService.clearActiveSection();
						// Also clear sections array to prevent scroll handler from trying to find sections
						this.scrollService.updateSections([]);
					}

					// Handle anchor scrolling for hash URLs
					const hash = event.urlAfterRedirects.split("#")[1];
					if (hash) {
						setTimeout(() => {
							const element = document.getElementById(hash);
							if (element) {
								element.scrollIntoView({
									behavior: "smooth",
									block: "start"
								});
							}
						}, 200);
					}
				}, 100);
			});
	}

	ngAfterViewInit() {
		interval(100)
			.pipe(
				takeWhile(
					() =>
						!document.body.classList.contains("light-mode") &&
						!document.body.classList.contains("dark-mode")
				)
			)
			.subscribe({
				complete: () => {
					setTimeout(() => {
						this.progressSpiner.set(false);
					}, 300);
				}
			});
	}

	scrollTo(sectionId: string) {
		this.scrollService.scrollTo(sectionId);
	}
}
