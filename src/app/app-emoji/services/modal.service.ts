/* Angular */
import { Injectable } from "@angular/core";

/* RxJS */
import { Observable, Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ModalService {
	private modalSubject: Subject<boolean> = new Subject<boolean>();

	watchModal(): Observable<boolean> {
		return this.modalSubject.asObservable();
	}

	openModal() {
		this.modalSubject.next(true);
	}

	closeModal() {
		this.modalSubject.next(false);
	}
}
