export interface EmojiInterface {
	icon: string;
	unicode: string;
	description: string;
	group: string;
	subgroup: string;
	animation: boolean;
}

export interface ResponseInterface extends EmojiInterface {}
