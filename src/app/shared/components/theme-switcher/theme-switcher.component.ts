import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, Renderer2, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-theme-switcher",
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: "./theme-switcher.component.html",
	styleUrl: "./theme-switcher.component.scss"
})
export class ThemeSwitcherComponent implements OnInit {
	public darkMode = signal(true);

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2
	) {}

	ngOnInit() {
		this.initializeTheme();
	}

	private initializeTheme() {
		const storedTheme = localStorage.getItem("theme");
		const isDarkMode = storedTheme ? storedTheme === "dark" : true; // Default to dark mode
		this.darkMode.set(isDarkMode);
		this.applyTheme();
	}

	public toggleTheme() {
		// Add transitioning class to prevent flickering
		this.renderer.addClass(this.document.body, "theme-transitioning");

		// Use requestAnimationFrame to ensure smooth transition
		requestAnimationFrame(() => {
			this.darkMode.set(!this.darkMode());
			localStorage.setItem("theme", this.darkMode() ? "dark" : "light");
			this.applyTheme();

			// Remove transitioning class after a short delay
			setTimeout(() => {
				this.renderer.removeClass(this.document.body, "theme-transitioning");
			}, 50);
		});
	}

	private applyTheme() {
		if (this.darkMode()) {
			this.renderer.addClass(this.document.body, "dark-mode");
			this.renderer.removeClass(this.document.body, "light-mode");
		} else {
			this.renderer.removeClass(this.document.body, "dark-mode");
			this.renderer.addClass(this.document.body, "light-mode");
		}
	}
}
