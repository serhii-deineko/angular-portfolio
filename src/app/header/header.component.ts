import { Component, Inject, OnInit, Renderer2 } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSwitcherComponent } from "src/app/shared/components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "src/app/shared/components/theme-switcher/theme-switcher.component";
import { ScrollService } from "../shared/services/scroll.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

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
export class HeaderComponent implements OnInit {
	activeSection = "";
	isMobileMenuOpen = false;

	constructor(private scrollService: ScrollService) {}

	ngOnInit() {
		this.scrollService.activeSection$.subscribe((section) => {
			this.activeSection = section || "";
		});
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
