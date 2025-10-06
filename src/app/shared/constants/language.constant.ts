export const DEFAULT_LANGUAGE: string = "en";
export const AVAILABLE_LANGUAGES: string[] = ["en", "pl", "ua", "fr", "de"];
export const LOCALES: { [key in string]: string } = {
	en: "en_US",
	pl: "pl_PL",
	ua: "uk_UA",
	fr: "fr_FR",
	de: "de_DE"
};
export const LANGUAGE_FULLNAMES: { [key in string]: string } = {
	en: "English",
	pl: "Polish",
	ua: "Ukrainian",
	fr: "French",
	de: "German"
};
export const LANGUAGE_FLAGS: { [key in string]: string } = {
	en: "🇬🇧",
	pl: "🇵🇱",
	ua: "🇺🇦",
	fr: "🇫🇷",
	de: "🇩🇪"
};
