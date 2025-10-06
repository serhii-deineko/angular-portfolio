export interface Project {
	id: string;
	title: string;
	description: string;
	tech: string[];
	keyPoints: string[];
	github?: string;
	demo?: {
		label?: string;
		type: string;
		url: string;
	}[];
	fullDescription?: string;
	images: number | null;
	video: boolean | null;
	sections?: {
		title: string;
		content: string;
	}[];
}
