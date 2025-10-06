import { animate, style, transition, trigger } from "@angular/animations";
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	ViewChild
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { filter, Subscription } from "rxjs";

@Component({
	selector: "app-contact",
	standalone: true,
	imports: [TranslateModule],
	templateUrl: "./contact.component.html",
	styleUrls: ["./contact.component.scss"],
	animations: [
		trigger("fadeInUp", [
			transition(":enter", [
				style({ opacity: 0, transform: "translateY(20px)" }),
				animate(
					"600ms cubic-bezier(0.4, 0, 0.2, 1)",
					style({
						opacity: 1,
						transform: "translateY(0)"
					})
				)
			])
		])
	]
})
export class ContactComponent implements AfterViewInit, OnDestroy {
	currentYear = new Date().getFullYear();
	hiddenFooter = false;
	private routerSubscription?: Subscription;

	@ViewChild("contactSection") contactSection!: ElementRef;

	constructor(
		private cdr: ChangeDetectorRef,
		private router: Router
	) {}

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
		const rect = this.contactSection.nativeElement.getBoundingClientRect();
		const scrollY = window.scrollY;
		const windowHeight = window.innerHeight;
		const currentUrl = this.router.url;

		const isContactSectionVisible = rect.top <= windowHeight && rect.bottom >= 0;
		const isNearTop = scrollY < 150;

		if (currentUrl === "/emojiseeker") {
			this.hiddenFooter = isContactSectionVisible;
		} else {
			this.hiddenFooter = isContactSectionVisible || isNearTop;
		}
	}
}
