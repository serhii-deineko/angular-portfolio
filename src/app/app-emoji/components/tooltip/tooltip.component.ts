/* Angular */
import { Component, ElementRef, ViewChild, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";

/* RxJS */
import { timer, Subscription } from "rxjs";

@Component({
	standalone: true,
	selector: "app-tooltip",
	imports: [CommonModule],
	templateUrl: "./tooltip.component.html",
	styleUrl: "./tooltip.component.scss"
})
export class TooltipComponent implements OnInit, OnDestroy {
	@ViewChild("tooltip") tooltip?: ElementRef<HTMLDivElement>;
	@Input() label?: string;

	private tooltipTimer?: Subscription;

	ngOnInit() {
		this.tooltipTimer = timer(500).subscribe(() => {
			if (this.tooltip?.nativeElement) {
				this.tooltip.nativeElement.classList.remove("opacity-0");
				this.tooltip.nativeElement.classList.add("opacity-100");
			}
		});
	}

	ngOnDestroy() {
		if (this.tooltipTimer) {
			this.tooltipTimer.unsubscribe();
		}
	}
}
