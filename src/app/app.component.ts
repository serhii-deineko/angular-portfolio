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
import { SEOService } from "./services/seo.service";
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
	private previousUrl = "";

	constructor(
		private scrollService: ScrollService,
		private translateService: TranslateService,
		private languageService: LanguageService,
		private router: Router,
		private seoService: SEOService
	) {
		this.languageService.initLanguage();
	}

	ngOnInit() {
		// Initialize previous URL with current URL
		this.previousUrl = this.router.url;

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
				const currentUrl = event.urlAfterRedirects;
				const currentBaseUrl = currentUrl.split("#")[0];
				const previousBaseUrl = this.previousUrl.split("#")[0];

				// Show progress spinner only if we're actually changing pages (not just anchor links)
				const isPageChange = currentBaseUrl !== previousBaseUrl;

				if (isPageChange) {
					this.progressSpiner.set(true);
					setTimeout(() => {
						this.progressSpiner.set(false);
					}, 1000);
				}

				// Small delay to ensure DOM is updated
				setTimeout(() => {
					// Check if we're on a page with sections (home page)
					if (currentUrl === "/" || currentUrl.includes("#")) {
						this.scrollService.updateSections(this.sections.map((s) => s.id));

						// Force re-initialization of scroll service for home page
						if (currentUrl === "/") {
							setTimeout(() => {
								this.scrollService.init(
									this.sections.map((s) => s.id),
									"scrollProgress"
								);
							}, 200);
						}
					} else {
						// Clear active section for pages without sections (like emoji-seeker)
						this.scrollService.clearActiveSection();
						// Also clear sections array to prevent scroll handler from trying to find sections
						this.scrollService.updateSections([]);
					}

					// Handle anchor scrolling for hash URLs
					const hash = currentUrl.split("#")[1];
					if (hash) {
						setTimeout(() => {
							// Use ScrollService for consistent scrolling behavior
							this.scrollService.scrollTo(hash);
						}, 200);
					}
				}, 100);

				// Update previous URL for next comparison
				this.previousUrl = currentUrl;
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
