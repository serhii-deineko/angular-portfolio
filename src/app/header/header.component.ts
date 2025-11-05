import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	HostListener,
	ChangeDetectorRef
} from "@angular/core";
import { RouterModule, NavigationEnd, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSwitcherComponent } from "src/app/shared/components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "src/app/shared/components/theme-switcher/theme-switcher.component";
import { ScrollService } from "../shared/services/scroll.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { filter, Subscription } from "rxjs";

@Component({
	selector: "app-header",
	imports: [
		LanguageSwitcherComponent,
		ThemeSwitcherComponent,
		TranslateModule,
		RouterModule,
		MatIconModule,
		MatButtonModule
	],
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
	standalone: true
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	activeSection = "";
	isMobileMenuOpen = false;
	hiddenTooltip = false;
	private routerSubscription?: Subscription;

	constructor(
		private scrollService: ScrollService,
		private cdr: ChangeDetectorRef,
		private router: Router
	) {}

	ngOnInit() {
		this.scrollService.activeSection$.subscribe((section) => {
			this.activeSection = section || "";
		});
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.checkVisibility();
			this.cdr.markForCheck();
		});

		this.routerSubscription = this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe(() => {
				setTimeout(() => {
					this.checkVisibility();
					this.cdr.markForCheck();
				});
			});
	}

	@HostListener("window:scroll")
	onWindowScroll() {
		this.checkVisibility();
	}

	@HostListener("window:popstate")
	onPopState() {
		this.checkVisibility();
	}

	ngOnDestroy() {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}

	private checkVisibility() {
		const contactSection = document.getElementById("contact");
		if (!contactSection) return;

		const rect = contactSection.getBoundingClientRect();
		const scrollY = window.scrollY;
		const windowHeight = window.innerHeight;
		const currentUrl = this.router.url;

		const isContactSectionVisible = rect.top + 700 <= windowHeight && rect.bottom >= 0;
		const isNearTop = scrollY < 150;

		const baseUrl = currentUrl.split("#")[0];
		const isHomePage = baseUrl === "/" || baseUrl === "";
		const isProjectDetailPage = /^\/(projects\/[^/]+|[^/]+)$/.test(baseUrl);

		if (baseUrl === "/emoji-seeker") {
			this.hiddenTooltip = isContactSectionVisible;
		} else if (isProjectDetailPage) {
			this.hiddenTooltip = isContactSectionVisible;
		} else if (isHomePage) {
			this.hiddenTooltip = isContactSectionVisible || isNearTop;
		} else {
			this.hiddenTooltip = isContactSectionVisible;
		}
	}

	toggleMobileMenu() {
		this.isMobileMenuOpen = !this.isMobileMenuOpen;
	}

	closeMobileMenu() {
		this.isMobileMenuOpen = false;
	}

	scrollToSection(sectionId: string, event?: Event) {
		// Check if we're on the home page
		const currentUrl = window.location.pathname;
		if (currentUrl === "/" || currentUrl === "") {
			// We're on home page, prevent default and use JS scroll
			if (event) {
				event.preventDefault();
			}
			// Update URL hash without triggering hashchange
			history.replaceState(null, "", `#${sectionId}`);
			this.scrollService.scrollTo(sectionId);
		}
		// If we're on another page, let the anchor link work normally
	}
}
