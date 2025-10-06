/* Angular */
import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

/* Services */
import { ModalService } from "../../services/modal.service";

@Component({
	standalone: true,
	selector: "app-modal",
	imports: [CommonModule],
	templateUrl: "./modal.component.html",
	styleUrl: "./modal.component.scss"
})
export class ModalComponent implements AfterViewInit {
	@ViewChild("modal") el?: ElementRef<HTMLDivElement>;

	constructor(private modalService: ModalService) {}

	ngAfterViewInit() {
		if (this.el?.nativeElement.classList.contains("hidden")) {
			this.el?.nativeElement.classList.remove("hidden");

			requestAnimationFrame(() => {
				this.el?.nativeElement.classList.add("opacity-100");
			});
		}
	}

	onModalClose() {
		this.el?.nativeElement.classList.remove("opacity-100");

		requestAnimationFrame(() => {
			this.el?.nativeElement.classList.add("opacity-0");
		});

		setTimeout(() => {
			this.modalService.closeModal();
		}, 250);
	}
}
