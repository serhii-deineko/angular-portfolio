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

			case "/#about":
				return {
					title: "About Serhii Deineko - Angular Frontend Developer",
					description:
						"Learn about Serhii Deineko's journey as an Angular Frontend Developer. 6+ years of experience in AI-powered applications, web development, and modern frontend solutions.",
					keywords:
						"about, Angular developer, experience, portfolio, frontend developer, AI applications",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/#about`,
					type: "website"
				};

			case "/#projects":
				return {
					title: "Projects - Serhii Deineko Portfolio",
					description:
						"Explore Serhii Deineko's portfolio of web applications and AI-powered solutions. Including AISEMA grant advisor, speech analysis platforms, mobile home configurators, and chatbot development.",
					keywords:
						"projects, portfolio, Angular applications, AI solutions, web development, mobile home configurator, speech analysis, chatbot",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/#projects`,
					type: "website"
				};

			case "/#experience":
				return {
					title: "Experience - Serhii Deineko Career",
					description:
						"Serhii Deineko's professional experience as Fullstack Developer at Networks.ua, Lark Leisure Homes, and Frontend Developer at Yarrl S.A. Specialized in Angular, AI applications, and modern web solutions.",
					keywords:
						"experience, career, Angular developer, fullstack developer, AI applications, Yarrl, Lark Leisure Homes, Networks.ua",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/#experience`,
					type: "website"
				};

			case "/#contact":
				return {
					title: "Contact Serhii Deineko - Angular Frontend Developer",
					description:
						"Get in touch with Serhii Deineko for Angular frontend development projects, AI application development, and modern web solutions. Available for freelance and full-time opportunities.",
					keywords:
						"contact, hire, Angular developer, frontend developer, AI applications, freelance, web development",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/#contact`,
					type: "website"
				};

			case "/emoji-seeker":
				return {
					title: "Emoji Seeker - Find Perfect Emojis | Serhii Deineko",
					description:
						"Advanced emoji search tool with AI-powered suggestions. Find the perfect emoji for any situation with our intelligent emoji seeker.",
					keywords: "emoji search, emoji finder, emoji tool, AI emoji, emoji suggestions",
					image: `${this.baseUrl}/logo.png`,
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
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}${cleanUrl}`,
					type: "website"
				};
		}
	}

	private getProjectSEOData(projectId: string): SEOData {
		const projects: Record<string, { title: string; description: string; keywords: string }> = {
			"aisema-ai-grant-advisor": {
				title: "AISEMA AI Grant Advisor - AI-Powered EU Funding Discovery Platform",
				description:
					"Revolutionary AI platform built with Angular and LLM technology that helps researchers and organizations discover and apply for relevant EU grants. Featured in Rzeczpospolita newspaper and partnered with Łukasiewicz ITECH.",
				keywords:
					"AI grant advisor, EU funding, grant discovery, machine learning, research funding, Angular, LLM, AISEMA, Yarrl"
			},
			"homes-offers-configurator": {
				title: "AI-Powered Flyer Configurator - Real Estate Marketing Tool",
				description:
					"AI-powered flyer configurator integrating multiple machine-learning models to auto-organize and categorize product images, with dynamic layout rendering and export to print-ready formats for real estate marketing.",
				keywords:
					"AI flyer configurator, real estate marketing, machine learning, image organization, print-ready formats, Lark Leisure Homes"
			},
			"mobile-homes-configurator": {
				title: "Mobile Homes Configurator - 3D Visualization & Custom Builder",
				description:
					"Custom mobile homes configurator built with vanilla JavaScript/PHP featuring bespoke event-bus state manager, DOM diff-and-patch engine for real-time previews, and secure PHP/SQL backend for configuration persistence.",
				keywords:
					"mobile homes configurator, 3D visualization, JavaScript, PHP, real-time preview, custom builder, Lark Leisure Homes"
			},
			"mobile-homes-order-app": {
				title: "Mobile Homes Order App - Angular Material & Firebase System",
				description:
					"Fully unified Angular Material & Firebase order-creation app with automated CI/CD, Firebase Auth, Firestore for order data, Storage for media, Firebase Functions for email notifications, and role-based access controls.",
				keywords:
					"Angular Material, Firebase, mobile homes order app, CI/CD, Firestore, role-based access, Lark Leisure Homes"
			},
			"speech-analysis-platform": {
				title: "Speech Analysis Platform - AI-Powered Call Center Analytics",
				description:
					"Angular frontend for call-center conversation analysis tool powered by advanced AI models. Features custom analyses from uploaded recordings, multi-criteria evaluation, consultant performance tracking, and SSO integration.",
				keywords:
					"speech analysis, call center analytics, AI voice processing, Angular, sentiment analysis, consultant performance, SSO integration, Yarrl"
			},
			"website-chatbot-plugin": {
				title: "AI Chatbot Plugin - Vector-Based Contextual Search & GPT Integration",
				description:
					"Vanilla JavaScript chatbot frontend for furniture e-commerce sites featuring vector-based contextual search, complaint filing/checking via XML API, and integrated GPT-based assistant responses. Deployed on multiple platforms including Ministry of Finance projects.",
				keywords:
					"AI chatbot, vector search, GPT integration, e-commerce, JavaScript, XML API, Ministry of Finance, Yarrl"
			}
		};

		const project = projects[projectId] || {
			title: `Project ${projectId} - Serhii Deineko Portfolio`,
			description: `Detailed information about ${projectId} project developed by Serhii Deineko.`,
			keywords: "portfolio, project, web development, Angular"
		};

		return {
			...project,
			image: `${this.baseUrl}/logo.png`,
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
