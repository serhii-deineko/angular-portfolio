export interface Project {
	id: string;
	title: string;
	description: string;
	tech: string[];
	keyPoints: string[];
	github?: string;
	demo?: {
		type: "youtube" | "pdf";
		url: string;
	};
	fullDescription?: string;
	images?: {
		src: string;
		caption: string;
	}[];
	sections?: {
		title: string;
		content: string;
	}[];
}
