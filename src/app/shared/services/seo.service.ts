import { Injectable, Inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";

export interface SEOData {
	title: string;
	description: string;
	keywords?: string;
	image?: string;
	url?: string;
	type?: string;
	author?: string;
}

@Injectable({
	providedIn: "root"
})
export class SEOService {
	private baseUrl = "https://serhii-deineko.web.app";

	constructor(
		private meta: Meta,
		private title: Title,
		private router: Router,
		@Inject(DOCUMENT) private document: Document
	) {
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				this.updateSEOForRoute(event.url);
			});
	}

	private updateSEOForRoute(url: string) {
		const route = this.getRouteData(url);
		this.updateMetaTags(route);
	}

	private getRouteData(url: string): SEOData {
		const cleanUrl = url.split("?")[0];

		switch (cleanUrl) {
			case "/":
				return {
					title: "Serhii Deineko - Angular Frontend Developer | AI & Web Solutions",
					description:
						"Angular Frontend Developer with 6+ years experience. Specialized in AI-powered applications, SPA development, and modern web solutions. Creator of AISEMA grant advisor, speech analysis platforms, and mobile home configurators.",
					keywords:
						"Angular developer, Frontend developer, AI applications, TypeScript, JavaScript, SPA development, Web solutions, Grant advisor, Speech analysis, Mobile home configurator, Chatbot development, Fullstack developer",
					image: `${this.baseUrl}/logo.png`,
					url: this.baseUrl,
					type: "website",
					author: "Serhii Deineko"
				};

			case "/about":
			case "/#about":
				return {
					title: "About Serhii Deineko - Angular Frontend Developer",
					description:
						"Learn about Serhii Deineko's journey as an Angular Frontend Developer. 6+ years of experience in AI-powered applications, web development, and modern frontend solutions.",
					keywords:
						"about, Angular developer, experience, portfolio, frontend developer, AI applications",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/about`,
					type: "website"
				};

			case "/projects":
			case "/#projects":
				return {
					title: "Projects - Serhii Deineko Portfolio",
					description:
						"Explore Serhii Deineko's portfolio of web applications and AI-powered solutions. Including AISEMA grant advisor, speech analysis platforms, mobile home configurators, and chatbot development.",
					keywords:
						"projects, portfolio, Angular applications, AI solutions, web development, mobile home configurator, speech analysis, chatbot",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/projects`,
					type: "website"
				};

			case "/experience":
			case "/#experience":
				return {
					title: "Experience - Serhii Deineko Career",
					description:
						"Serhii Deineko's professional experience as Fullstack Developer at Networks.ua, Lark Leisure Homes, and Frontend Developer at Yarrl S.A. Specialized in Angular, AI applications, and modern web solutions.",
					keywords:
						"experience, career, Angular developer, fullstack developer, AI applications, Yarrl, Lark Leisure Homes, Networks.ua",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/experience`,
					type: "website"
				};

			case "/contact":
			case "/#contact":
				return {
					title: "Contact Serhii Deineko - Angular Frontend Developer",
					description:
						"Get in touch with Serhii Deineko for Angular frontend development projects, AI application development, and modern web solutions. Available for freelance and full-time opportunities.",
					keywords:
						"contact, hire, Angular developer, frontend developer, AI applications, freelance, web development",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/contact`,
					type: "website"
				};

			case "/emoji-seeker":
				return {
					title: "🔍 Emoji Seeker - Find the perfect emoji for any situation using AI-powered search",
					description:
						"Advanced emoji search tool with AI-powered suggestions. Find the perfect emoji for any situation with our intelligent emoji seeker.",
					keywords: "emoji search, emoji finder, emoji tool, AI emoji, emoji suggestions",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/emoji-seeker`,
					type: "website"
				};

			default:
				return {
					title: "Serhii Deineko - Angular Frontend Developer",
					description:
						"Experienced Angular Frontend Developer specializing in modern web applications.",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}${cleanUrl}`,
					type: "website"
				};
		}
	}

	updateMetaTags(data: SEOData) {
		this.title.setTitle(data.title);

		this.meta.updateTag({ name: "description", content: data.description });
		this.meta.updateTag({ name: "keywords", content: data.keywords || "" });
		this.meta.updateTag({ name: "author", content: data.author || "Serhii Deineko" });

		this.meta.updateTag({ property: "og:title", content: data.title });
		this.meta.updateTag({ property: "og:description", content: data.description });
		this.meta.updateTag({
			property: "og:image",
			content: data.image || `${this.baseUrl}/logo.png`
		});
		this.meta.updateTag({ property: "og:url", content: data.url || this.baseUrl });
		this.meta.updateTag({ property: "og:type", content: data.type || "website" });
		this.meta.updateTag({ property: "og:site_name", content: "Serhii Deineko Portfolio" });

		this.meta.updateTag({ name: "twitter:card", content: "summary_large_image" });
		this.meta.updateTag({ name: "twitter:title", content: data.title });
		this.meta.updateTag({ name: "twitter:description", content: data.description });
		this.meta.updateTag({
			name: "twitter:image",
			content: data.image || `${this.baseUrl}/logo.png`
		});

		this.updateCanonicalUrl(data.url || this.baseUrl);

		const cleanUrl = (data.url || "").replace(this.baseUrl, "");
		const isProjectPage = cleanUrl.startsWith("/projects/");

		if (isProjectPage) {
			this.meta.updateTag({ name: "robots", content: "noindex, nofollow" });
			this.meta.updateTag({ name: "googlebot", content: "noindex, nofollow" });
		} else {
			this.meta.updateTag({
				name: "robots",
				content:
					"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
			});
			this.meta.updateTag({
				name: "googlebot",
				content:
					"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
			});
		}

		if (data.url === this.baseUrl || data.url === `${this.baseUrl}/`) {
			this.setStructuredData(this.getHomeStructuredData());
		} else {
			this.clearStructuredData();
		}
	}

	private setStructuredData(payload: unknown) {
		const existing = this.document.getElementById("structured-data");
		if (existing) existing.remove();
		const script = this.document.createElement("script");
		script.type = "application/ld+json";
		script.id = "structured-data";
		script.text = JSON.stringify(payload);
		this.document.head.appendChild(script);
	}

	private clearStructuredData() {
		const existing = this.document.getElementById("structured-data");
		if (existing) existing.remove();
	}

	private updateCanonicalUrl(url: string) {
		let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

		if (!link) {
			link = this.document.createElement("link");
			link.setAttribute("rel", "canonical");
			this.document.head.appendChild(link);
		}

		link.setAttribute("href", url);
	}

	private getHomeStructuredData() {
		return [
			{
				"@context": "https://schema.org",
				"@type": "WebSite",
				"@id": `${this.baseUrl}/#website`,
				url: this.baseUrl,
				name: "Serhii Deineko Portfolio",
				description:
					"Angular Frontend Developer portfolio showcasing AI-powered applications and modern web solutions",
				inLanguage: "en-US",
				potentialAction: {
					"@type": "SearchAction",
					target: {
						"@type": "EntryPoint",
						urlTemplate: `${this.baseUrl}/?s={search_term_string}`
					},
					"query-input": "required name=search_term_string"
				}
			},
			{
				"@context": "https://schema.org",
				"@type": "Person",
				"@id": `${this.baseUrl}/#person`,
				name: "Serhii Deineko",
				jobTitle: "Angular Frontend Developer",
				description:
					"Angular Frontend Developer with 6+ years experience specializing in AI-powered applications, SPA development, and modern web solutions",
				url: this.baseUrl,
				image: `${this.baseUrl}/logo.png`,
				sameAs: ["https://github.com/sdeineko", "https://linkedin.com/in/serhii-deineko"],
				knowsAbout: [
					"Angular",
					"TypeScript",
					"JavaScript",
					"AI Applications",
					"Machine Learning",
					"Web Development"
				],
				hasOccupation: {
					"@type": "Occupation",
					name: "Frontend Developer",
					occupationLocation: {
						"@type": "Country",
						name: "Poland"
					},
					estimatedSalary: {
						"@type": "MonetaryAmountDistribution",
						name: "base",
						currency: "EUR"
					},
					skills: "Angular, TypeScript, AI Applications, Firebase, Docker, CI/CD"
				},
				alumniOf: [
					{
						"@type": "EducationalOrganization",
						name: "PSW w Białej Podlaskiej",
						location: "Poland"
					},
					{
						"@type": "EducationalOrganization",
						name: "Dnipro University of Technology",
						location: "Ukraine"
					}
				],
				worksFor: [
					{
						"@type": "Organization",
						name: "Yarrl S.A.",
						description: "Frontend Developer - AI Applications"
					},
					{
						"@type": "Organization",
						name: "Lark Leisure Homes",
						description: "Fullstack Developer - Web Solutions"
					}
				]
			},
			{
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: this.baseUrl
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "About",
						item: `${this.baseUrl}/about`
					},
					{
						"@type": "ListItem",
						position: 3,
						name: "Projects",
						item: `${this.baseUrl}/projects`
					},
					{
						"@type": "ListItem",
						position: 4,
						name: "Experience",
						item: `${this.baseUrl}/experience`
					},
					{
						"@type": "ListItem",
						position: 5,
						name: "Contact",
						item: `${this.baseUrl}/contact`
					}
				]
			},
			{
				"@context": "https://schema.org",
				"@type": "ProfilePage",
				"@id": `${this.baseUrl}/#profilepage`,
				mainEntity: {
					"@id": `${this.baseUrl}/#person`
				},
				breadcrumb: {
					"@id": `${this.baseUrl}/#breadcrumb`
				}
			}
		];
	}
}
