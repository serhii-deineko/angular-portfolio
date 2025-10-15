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
		const cleanUrl = url.split("?")[0].split("#")[0];

		switch (cleanUrl) {
			case "/":
				return {
					title: "Serhii Deineko - Angular Frontend Developer | Portfolio",
					description:
						"Experienced Angular Developer with 5+ years experience. Expert in modern web applications, AI-powered solutions, and enterprise software. Specializing in TypeScript, RxJS, and cutting-edge frontend technologies. View my portfolio of innovative projects.",
					keywords:
						"Experienced Angular Developer, TypeScript expert, AI web applications, Enterprise software, RxJS, Modern web development, JavaScript, Portfolio, Web solutions, AI projects, Mobile applications, Speech analysis, Grant advisor",
					image: `${this.baseUrl}/logo.png`,
					url: this.baseUrl,
					type: "website",
					author: "Serhii Deineko"
				};

			case "/emoji-seeker":
				return {
					title: "Emoji Seeker - AI-Powered Emoji Search Tool | Serhii Deineko",
					description:
						"Advanced emoji search tool with AI-powered suggestions. Find the perfect emoji for any situation with our intelligent emoji seeker. Built with Angular and modern web technologies.",
					keywords:
						"emoji search, emoji finder, emoji tool, AI emoji, emoji suggestions, Angular app, web tool",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/emoji-seeker`,
					type: "website"
				};

			case "/projects":
				return {
					title: "Projects - Innovative Web Solutions & AI Applications | Serhii Deineko",
					description:
						"Explore my portfolio of innovative projects including AI grant advisor, speech analysis platforms, mobile applications, and enterprise web solutions. Each project showcases expertise in Angular, TypeScript, and modern development practices.",
					keywords:
						"Angular projects, AI applications, Web development portfolio, TypeScript projects, Enterprise software, Mobile applications, Speech analysis, Grant advisor platform",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/projects`,
					type: "website",
					author: "Serhii Deineko"
				};

			case "/contact":
				return {
					title: "Contact - Get In Touch | Serhii Deineko - Experienced Angular Developer",
					description:
						"Ready to discuss your next project? Contact me for Angular development, AI-powered web applications, or enterprise software solutions. Let's build something amazing together.",
					keywords:
						"Contact Angular developer, Hire frontend developer, Web development services, Angular consulting, AI web applications, Enterprise software development",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}/contact`,
					type: "website",
					author: "Serhii Deineko"
				};

			default:
				if (cleanUrl.startsWith("/projects/")) {
					const projectId = cleanUrl.split("/projects/")[1];
					return this.getProjectSEOData(projectId);
				}

				if (cleanUrl.includes("#about")) {
					return {
						title: "About Me - Experienced Angular Developer | Serhii Deineko",
						description:
							"Learn about my journey as a Experienced Angular Developer. 5+ years of experience in modern web development, AI applications, and enterprise software solutions. Passionate about creating innovative digital experiences.",
						keywords:
							"About Angular developer, Experienced frontend developer, Web development experience, Angular expertise, TypeScript skills, AI applications developer",
						image: `${this.baseUrl}/logo.png`,
						url: `${this.baseUrl}#about`,
						type: "website",
						author: "Serhii Deineko"
					};
				}

				if (cleanUrl.includes("#experience")) {
					return {
						title: "Experience - Professional Background | Serhii Deineko",
						description:
							"Discover my professional experience as a Experienced Angular Developer. From enterprise applications to AI-powered solutions, explore the projects and technologies that have shaped my career in modern web development.",
						keywords:
							"Angular developer experience, Frontend development career, Professional background, Web development skills, Enterprise software experience, AI applications development",
						image: `${this.baseUrl}/logo.png`,
						url: `${this.baseUrl}#experience`,
						type: "website",
						author: "Serhii Deineko"
					};
				}

				return {
					title: "Serhii Deineko - Experienced Angular Developer | Modern Web Solutions",
					description:
						"Experienced Angular Developer with 5+ years experience. Expert in modern web applications, AI-powered solutions, and enterprise software. Specializing in TypeScript, RxJS, and cutting-edge frontend technologies.",
					image: `${this.baseUrl}/logo.png`,
					url: `${this.baseUrl}${cleanUrl}`,
					type: "website",
					author: "Serhii Deineko"
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
		this.meta.updateTag({ property: "og:locale", content: "en_US" });

		this.meta.updateTag({ name: "twitter:card", content: "summary_large_image" });
		this.meta.updateTag({ name: "twitter:title", content: data.title });
		this.meta.updateTag({ name: "twitter:description", content: data.description });
		this.meta.updateTag({
			name: "twitter:image",
			content: data.image || `${this.baseUrl}/logo.png`
		});
		this.meta.updateTag({ name: "twitter:creator", content: "@serhii_deineko" });

		this.meta.updateTag({ name: "robots", content: "index, follow" });
		this.meta.updateTag({ name: "googlebot", content: "index, follow" });

		this.updateBreadcrumbs(data.url || this.baseUrl);
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

	private updateBreadcrumbs(url: string) {
		const breadcrumbs = this.generateBreadcrumbs(url);
		this.addStructuredData(breadcrumbs);
	}

	private generateBreadcrumbs(url: string) {
		const urlPath = url.replace(this.baseUrl, "");
		const segments = urlPath.split("/").filter((segment) => segment && segment !== "");

		const breadcrumbItems = [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: this.baseUrl
			}
		];

		let currentPath = this.baseUrl;
		let position = 2;

		segments.forEach((segment) => {
			currentPath += `/${segment}`;

			let name = segment;
			if (segment === "projects") {
				name = "Projects";
			} else if (segment === "contact") {
				name = "Contact";
			} else if (segment === "emoji-seeker") {
				name = "Emoji Seeker";
			} else if (segment.startsWith("#")) {
				const section = segment.replace("#", "");
				if (section === "about") {
					name = "About Me";
				} else if (section === "experience") {
					name = "Experience";
				}
			} else {
				name = segment
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ");
			}

			breadcrumbItems.push({
				"@type": "ListItem",
				position: position,
				name: name,
				item: currentPath
			});

			position++;
		});

		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbItems
		};
	}
}
