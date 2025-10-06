export interface MessageInterface {
	role: "system" | "user" | "assistant";
	content: string;
	name?: string;
}
