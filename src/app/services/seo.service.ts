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
	private baseUrl = "https://serhii-deineko.web.app"; // Замените на ваш домен

	constructor(
		private meta: Meta,
		private title: Title,
		private router: Router,
		@Inject(DOCUMENT) private document: Document
	) {
		this.initializeSEO();
	}

	private initializeSEO() {
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
		const cleanUrl = url.split("?")[0].split("#")[0];

		switch (cleanUrl) {
			case "/":
				return {
					title: "Serhii Deineko - Angular Frontend Developer | Portfolio",
					description:
						"Experienced Angular Frontend Developer specializing in modern web applications, SPA development, and user experience optimization.",
					keywords:
						"Angular developer, Frontend developer, Web development, JavaScript, TypeScript, Portfolio",
					image: `${this.baseUrl}/assets/logo.png`,
					url: this.baseUrl,
					type: "website",
					author: "Serhii Deineko"
				};

			case "/emoji-seeker":
				return {
					title: "Emoji Seeker - Find Perfect Emojis | Serhii Deineko",
					description:
						"Advanced emoji search tool with AI-powered suggestions. Find the perfect emoji for any situation with our intelligent emoji seeker.",
					keywords: "emoji search, emoji finder, emoji tool, AI emoji, emoji suggestions",
					image: `${this.baseUrl}/assets/logo.png`,
					url: `${this.baseUrl}/emoji-seeker`,
					type: "website"
				};

			default:
				if (cleanUrl.startsWith("/projects/")) {
					const projectId = cleanUrl.split("/projects/")[1];
					return this.getProjectSEOData(projectId);
				}

				return {
					title: "Serhii Deineko - Angular Frontend Developer",
					description:
						"Experienced Angular Frontend Developer specializing in modern web applications.",
					image: `${this.baseUrl}/assets/logo.png`,
					url: `${this.baseUrl}${cleanUrl}`,
					type: "website"
				};
		}
	}

	private getProjectSEOData(projectId: string): SEOData {
		const projects: Record<string, { title: string; description: string; keywords: string }> = {
			"aisema-ai-grant-advisor": {
				title: "AISEMA AI Grant Advisor - AI-Powered Grant Discovery Platform",
				description:
					"Revolutionary AI platform that helps researchers and organizations discover and apply for relevant grants using advanced machine learning algorithms.",
				keywords:
					"AI grant advisor, grant discovery, machine learning, research funding, AI platform"
			},
			"homes-offers-configurator": {
				title: "Homes Offers Configurator - Real Estate Configuration Tool",
				description:
					"Interactive configuration tool for real estate offers with dynamic pricing and customization options.",
				keywords: "real estate, home configurator, property configuration, real estate tool"
			},
			"mobile-homes-configurator": {
				title: "Mobile Homes Configurator - Custom Mobile Home Builder",
				description:
					"Comprehensive mobile home configuration platform with 3D visualization and customization options.",
				keywords: "mobile homes, home configurator, 3D visualization, mobile home builder"
			},
			"mobile-homes-order-app": {
				title: "Mobile Homes Order App - Streamlined Ordering System",
				description:
					"Efficient mobile application for ordering mobile homes with integrated payment and tracking systems.",
				keywords: "mobile app, order system, mobile homes, e-commerce, mobile ordering"
			},
			"speech-analysis-platform": {
				title: "Speech Analysis Platform - Advanced Voice Analytics",
				description:
					"Cutting-edge speech analysis platform with real-time voice processing and sentiment analysis capabilities.",
				keywords:
					"speech analysis, voice analytics, sentiment analysis, voice processing, AI speech"
			},
			"website-chatbot-plugin": {
				title: "Website Chatbot Plugin - Intelligent Customer Support",
				description:
					"Smart chatbot plugin for websites providing automated customer support and lead generation.",
				keywords: "chatbot, customer support, lead generation, website plugin, AI assistant"
			}
		};

		const project = projects[projectId] || {
			title: `Project ${projectId} - Serhii Deineko Portfolio`,
			description: `Detailed information about ${projectId} project developed by Serhii Deineko.`,
			keywords: "portfolio, project, web development, Angular"
		};

		return {
			...project,
			image: `${this.baseUrl}/assets/logo.png`,
			url: `${this.baseUrl}/projects/${projectId}`,
			type: "article",
			author: "Serhii Deineko"
		};
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
			content: data.image || `${this.baseUrl}/assets/logo.png`
		});
		this.meta.updateTag({ property: "og:url", content: data.url || this.baseUrl });
		this.meta.updateTag({ property: "og:type", content: data.type || "website" });
		this.meta.updateTag({ property: "og:site_name", content: "Serhii Deineko Portfolio" });

		this.meta.updateTag({ name: "twitter:card", content: "summary_large_image" });
		this.meta.updateTag({ name: "twitter:title", content: data.title });
		this.meta.updateTag({ name: "twitter:description", content: data.description });
		this.meta.updateTag({
			name: "twitter:image",
			content: data.image || `${this.baseUrl}/assets/logo.png`
		});

		this.meta.updateTag({ name: "robots", content: "index, follow" });
		this.meta.updateTag({ name: "googlebot", content: "index, follow" });
	}

	updateTitle(title: string) {
		this.title.setTitle(title);
	}

	updateDescription(description: string) {
		this.meta.updateTag({ name: "description", content: description });
	}

	addStructuredData(data: any) {
		const script = this.document.createElement("script");
		script.type = "application/ld+json";
		script.text = JSON.stringify(data);
		script.id = "structured-data";

		const existingScript = this.document.getElementById("structured-data");
		if (existingScript) {
			existingScript.remove();
		}

		this.document.head.appendChild(script);
	}

	removeStructuredData() {
		const existingScript = this.document.getElementById("structured-data");
		if (existingScript) {
			existingScript.remove();
		}
	}
}
