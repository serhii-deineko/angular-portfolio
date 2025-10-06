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
		if (storedTheme) {
			this.darkMode.set(storedTheme === "dark");
		}
		this.applyTheme();
	}

	public toggleTheme() {
		this.darkMode.set(!this.darkMode());
		localStorage.setItem("theme", this.darkMode() ? "dark" : "light");
		this.applyTheme();
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
