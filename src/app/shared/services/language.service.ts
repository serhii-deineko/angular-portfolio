import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Meta } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, LOCALES } from "../constants/language.constant";

@Injectable({
	providedIn: "root"
})
export class LanguageService {
	public language = signal<string>(DEFAULT_LANGUAGE);
	public language$ = toObservable(this.language);

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object,
		private translateService: TranslateService,
		private meta: Meta
	) {}

	public initLanguage(): void {
		let language = DEFAULT_LANGUAGE;

		if (isPlatformBrowser(this.platformId)) {
			language = localStorage.getItem("language") || DEFAULT_LANGUAGE;
		}

		this.language.set(language);
		this.setLanguage(this.language());
	}

	public setLanguage(language: string): void {
		this.setHtmlLang(language);
		this.setOgTags(language);

		this.language.set(language);
		this.translateService.use(language);

		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem("language", language);
		}
	}

	public getAvailableLanguages(): string[] {
		return AVAILABLE_LANGUAGES;
	}

	private setHtmlLang(language: string): void {
		if (this?.document?.documentElement) {
			this.document.documentElement.lang = language;
		}
	}

	private setOgTags(language: string): void {
		this.meta.removeTag(`content='${this.formatLanguage(language)}'`);
		this.meta.updateTag({ property: "og:locale", content: this.formatLanguage(language) });
		this.meta.addTags(
			AVAILABLE_LANGUAGES.filter((lang) => lang !== language).map((lang) => ({
				property: "og:locale:alternate",
				content: this.formatLanguage(lang)
			}))
		);
	}

	private formatLanguage(language: string): string {
		return LOCALES[language];
	}
}
