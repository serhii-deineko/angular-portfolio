import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	signal
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateService } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";
import { LANGUAGE_FLAGS, LANGUAGE_FULLNAMES } from "../../constants/language.constant";
import { Language } from "../../interfaces/language.interface";
import { LanguageService } from "../../services/language.service";
import { StorageService } from "../../services/storage.service";

@Component({
	selector: "app-language-switcher",
	standalone: true,
	imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
	templateUrl: "./language-switcher.component.html",
	styleUrl: "./language-switcher.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
	public availableLanguages: Language[];
	public currentLang = signal<Language>("en");

	public readonly LANGUAGE_FULLNAMES = LANGUAGE_FULLNAMES;
	public readonly LANGUAGE_FLAGS = LANGUAGE_FLAGS;

	private destroy$ = new Subject<void>();

	constructor(
		public languageService: LanguageService,
		public translate: TranslateService,
		private cdr: ChangeDetectorRef,
		private storageService: StorageService
	) {
		this.availableLanguages = languageService.getAvailableLanguages();
		const storedLang = this.storageService.getItem("language") as Language;
		const currentLang = storedLang || translate.currentLang || translate.defaultLang || "en";
		this.currentLang.set(currentLang as Language);
	}

	ngOnInit(): void {
		this.languageService.language$.pipe(takeUntil(this.destroy$)).subscribe((language) => {
			this.currentLang.set(language);
			this.cdr.markForCheck();
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public setLanguage(language: Language) {
		this.languageService.setLanguage(language);
	}
}
