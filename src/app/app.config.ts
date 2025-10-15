import { registerLocaleData } from "@angular/common";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeEn from "@angular/common/locales/en";
import localeFr from "@angular/common/locales/fr";
import localePl from "@angular/common/locales/pl";
import localeUk from "@angular/common/locales/uk";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, withViewTransitions, withInMemoryScrolling } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { version } from "../../package.json";
import { routes } from "./app.routes";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";

registerLocaleData(localeEn, "en-EN");
registerLocaleData(localePl, "pl-PL");
registerLocaleData(localeUk, "uk-UA");
registerLocaleData(localeFr, "fr-FR");
registerLocaleData(localeDe, "de-DE");

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, "./assets/i18n/", `.json?v=${version}`);
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		importProvidersFrom([
			TranslateModule.forRoot({
				defaultLanguage: "en",
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			})
		]),
		provideRouter(
			routes,
			withViewTransitions(),
			withInMemoryScrolling({
				scrollPositionRestoration: "top",
				anchorScrolling: "enabled"
			})
		),
		provideAnimationsAsync(),
		provideAnimations(),
		provideHttpClient(),
		provideClientHydration(withEventReplay())
	]
};
