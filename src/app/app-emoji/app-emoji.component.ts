/* Angular */
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

/* RxJS */
import { Observable } from "rxjs";

/* Components */
import { SearchComponent } from "./components/search/search.component";
import { TooltipComponent } from "./components/tooltip/tooltip.component";

/* Interfaces */
import { TooltipInterface } from "./interfaces/tooltip.interface";

/* Services */
import { ModalService } from "./services/modal.service";
import { TooltipService } from "./services/tooltip.service";
import { ModalComponent } from "./components/modal/modal.component";
import { RouterComponent } from "./components/router/router.component";
import { ScrollService } from "../services/scroll.service";

@Component({
	selector: "app-emoji-seeker",
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		SearchComponent,
		TooltipComponent,
		ModalComponent,
		RouterComponent
	],
	templateUrl: "./app-emoji.component.html",
	styleUrl: "./app-emoji.component.scss",
	encapsulation: ViewEncapsulation.None
})
export class EmojiSeekerComponent implements OnInit {
	modal$: Observable<boolean>;
	tooltip$: Observable<TooltipInterface | null>;

	constructor(
		private modalService: ModalService,
		private tooltipService: TooltipService,
		private scrollService: ScrollService
	) {
		this.modal$ = this.modalService.watchModal();
		this.tooltip$ = this.tooltipService.watchTooltip();
	}

	ngOnInit() {
		// Clear active section since this page has no sections
		this.scrollService.clearActiveSection();

		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 0);
	}
}
