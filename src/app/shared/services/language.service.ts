import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Meta } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, LOCALES } from "../constants/language.constant";
import { Language } from "../interfaces/language.interface";
import { StorageService } from "./storage.service";

@Injectable({
	providedIn: "root"
})
export class LanguageService {
	public language = signal<Language>(DEFAULT_LANGUAGE);
	public language$ = toObservable(this.language);

	constructor(
		@Inject(DOCUMENT) private doc: Document,
		private translate: TranslateService,
		private meta: Meta,
		private storageService: StorageService
	) {}

	public initLanguage(): void {
		const storedLang = this.storageService.getItem("language") as Language;
		const currentLang =
			storedLang || this.translate.currentLang || this.translate.defaultLang || "en";
		this.setLanguage(currentLang as Language);
	}

	public setLanguage(language: Language): void {
		this.translate.use(language);
		this.setHtmlLang(language);
		this.setOgTags(language);
		this.language.set(language);
		this.storageService.setItem("language", language);
	}

	public getAvailableLanguages(): Language[] {
		return AVAILABLE_LANGUAGES;
	}

	private setHtmlLang(language: Language): void {
		if (this?.doc?.documentElement) {
			this.doc.documentElement.lang = language;
		}
	}

	private setOgTags(language: Language): void {
		this.meta.removeTag(`content='${this.formatLang(language)}'`);
		this.meta.updateTag({ property: "og:locale", content: this.formatLang(language) });
		this.meta.addTags(
			AVAILABLE_LANGUAGES.filter((lang) => lang !== language).map((lang) => ({
				property: "og:locale:alternate",
				content: this.formatLang(lang)
			}))
		);
	}

	private formatLang(language: Language): string {
		return LOCALES[language];
	}
}
