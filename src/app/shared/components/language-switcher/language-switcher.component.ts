import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	signal
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/shared/services/language.service";
import { LANGUAGE_FLAGS, LANGUAGE_FULLNAMES } from "../../constants/language.constant";

@Component({
	selector: "app-language-switcher",
	standalone: true,
	imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
	templateUrl: "./language-switcher.component.html",
	styleUrl: "./language-switcher.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent implements OnInit {
	public availableLanguages: string[];
	public currentLang = signal("");

	public readonly LANGUAGE_FULLNAMES = LANGUAGE_FULLNAMES;
	public readonly LANGUAGE_FLAGS = LANGUAGE_FLAGS;

	constructor(
		public languageService: LanguageService,
		public translate: TranslateService,
		private cdr: ChangeDetectorRef
	) {
		this.availableLanguages = languageService.getAvailableLanguages();
		this.currentLang.set(translate.currentLang);
	}

	ngOnInit(): void {
		setTimeout(() => {
			this.cdr.markForCheck();
		});
	}

	public setLanguage(language: string) {
		this.languageService.setLanguage(language);
		this.currentLang.set(language);
	}
}
