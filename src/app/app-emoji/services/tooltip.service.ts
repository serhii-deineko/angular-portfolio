/* Angular */
import { Injectable } from "@angular/core";

/* RxJS */
import { Observable, Subject, timer, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

/* Interfaces */
import { TooltipInterface } from "../interfaces/tooltip.interface";

@Injectable({
	providedIn: "root"
})
export class TooltipService {
	private tooltipSubject: Subject<TooltipInterface | null> =
		new Subject<TooltipInterface | null>();
	private hideTimer?: Subscription;
	private currentTrigger?: HTMLElement;

	watchTooltip(): Observable<TooltipInterface | null> {
		return this.tooltipSubject.asObservable().pipe(
			debounceTime(50),
			distinctUntilChanged((prev, curr) => {
				if (!prev && !curr) return true;
				if (!prev || !curr) return false;
				return (
					prev.tooltip === curr.tooltip &&
					prev.position.top === curr.position.top &&
					prev.position.left === curr.position.left
				);
			})
		);
	}

	showTooltip(trigger: HTMLElement, tooltip: string) {
		// Отменяем предыдущий таймер скрытия
		if (this.hideTimer) {
			this.hideTimer.unsubscribe();
		}

		// Проверяем, что элемент существует и видим
		if (!trigger || !trigger.getBoundingClientRect) {
			return;
		}

		this.currentTrigger = trigger;
		const rect = trigger.getBoundingClientRect();

		// Проверяем, что элемент видим на экране
		if (rect.width === 0 || rect.height === 0) {
			return;
		}

		const position = {
			top: `${rect.top - rect.height}px`,
			left: `${rect.left + rect.width / 2}px`
		};
		this.tooltipSubject.next({ tooltip, position });
	}

	hideTooltip() {
		// Отменяем предыдущий таймер если есть
		if (this.hideTimer) {
			this.hideTimer.unsubscribe();
		}

		// Добавляем небольшую задержку для плавности
		this.hideTimer = timer(100).subscribe(() => {
			this.tooltipSubject.next(null);
			this.currentTrigger = undefined;
		});
	}
}
