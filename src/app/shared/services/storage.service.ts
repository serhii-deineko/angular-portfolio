import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class StorageService {
	private isBrowser: boolean;

	constructor(@Inject(DOCUMENT) private document: Document) {
		this.isBrowser =
			typeof this.document !== "undefined" &&
			typeof this.document.defaultView !== "undefined";
	}

	getItem(key: string): string | null {
		if (!this.isBrowser) {
			return null;
		}
		return this.document.defaultView?.localStorage?.getItem(key) || null;
	}

	setItem(key: string, value: string): void {
		if (!this.isBrowser) {
			return;
		}
		this.document.defaultView?.localStorage?.setItem(key, value);
	}

	removeItem(key: string): void {
		if (!this.isBrowser) {
			return;
		}
		this.document.defaultView?.localStorage?.removeItem(key);
	}

	clear(): void {
		if (!this.isBrowser) {
			return;
		}
		this.document.defaultView?.localStorage?.clear();
	}
}
