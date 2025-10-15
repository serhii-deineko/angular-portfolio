import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class ScrollService {
	private activeSection = new BehaviorSubject<string>("");
	activeSection$ = this.activeSection.asObservable();

	private sections: HTMLElement[] = [];
	private scrollProgress!: HTMLElement;

	init(sections: string[], scrollProgressId: string) {
		this.sections = sections
			.map((id) => document.getElementById(id))
			.filter((section) => section !== null) as HTMLElement[];
		this.scrollProgress = document.getElementById(scrollProgressId)!;
		window.addEventListener("scroll", this.handleScroll.bind(this));
		window.addEventListener("hashchange", this.handleHashChange.bind(this));
	}

	scrollTo(sectionId: string) {
		document.getElementById(sectionId)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}

	updateSections(sections: string[]) {
		this.sections = sections
			.map((id) => document.getElementById(id))
			.filter((section) => section !== null) as HTMLElement[];
		// Trigger scroll handler to update active section
		this.handleScroll();
	}

	// Method to check if we're on a page with sections
	hasSections(): boolean {
		return this.sections.length > 0;
	}

	clearActiveSection() {
		this.activeSection.next("");
	}

	private handleScroll() {
		// Update progress bar
		const winScroll = document.documentElement.scrollTop;
		const height =
			document.documentElement.scrollHeight - document.documentElement.clientHeight;
		this.scrollProgress.style.width = (winScroll / height) * 100 + "%";

		// If no sections are available, clear active section and return
		if (this.sections.length === 0) {
			if (this.activeSection.value !== "") {
				this.activeSection.next("");
			}
			return;
		}

		// Update active section
		const scrollPosition = window.scrollY + 100;
		let currentActiveSection = "";

		// Find the section that is currently in view
		// Check each section to see if it's in the viewport
		for (const section of this.sections) {
			if (section) {
				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;
				const sectionBottom = sectionTop + sectionHeight;

				// Check if the scroll position is within this section
				if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
					currentActiveSection = section.id;
					break;
				}
			}
		}

		// If no section is in view, find the closest one above the scroll position
		if (!currentActiveSection) {
			for (let i = this.sections.length - 1; i >= 0; i--) {
				const section = this.sections[i];
				if (section && section.offsetTop <= scrollPosition) {
					currentActiveSection = section.id;
					break;
				}
			}
		}

		// If we're at the very top and no section is found, default to first section
		if (!currentActiveSection && scrollPosition < 200) {
			currentActiveSection = this.sections[0]?.id || "";
		}

		// If we're scrolling up and past the first section, clear active section
		if (scrollPosition < 50 && this.activeSection.value !== "") {
			currentActiveSection = "";
		}

		// Only update if we found a valid section and it's different from current
		if (currentActiveSection && currentActiveSection !== this.activeSection.value) {
			this.activeSection.next(currentActiveSection);
		}
	}

	private handleHashChange() {
		const hash = window.location.hash.slice(1);
		if (hash && this.sections.some((section) => section.id === hash)) {
			document.getElementById(hash)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
	}
}
