/* Angular */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

/* Interfaces */
import { EmojiInterface } from "../interfaces/emoji.interface";

/* Libraries */
import { forkJoin, lastValueFrom } from "rxjs";
import { saveAs } from "file-saver";
import JSZip from "jszip";

@Injectable({
	providedIn: "root"
})
export class DownloadService {
	constructor(private http: HttpClient) {}

	async downloadZip(emoji: EmojiInterface) {
		const zip = new JSZip();

		const imageExtensions = ["png", "webp"];
		const imageObservables = imageExtensions.map((ext) => {
			const url = `assets/emoji/${ext}/${emoji?.unicode}.${ext}`;
			return this.http.get(url, { responseType: "blob" });
		});

		const blobs = await lastValueFrom(forkJoin(imageObservables));
		blobs.forEach((blob, index) => {
			zip.file(`${emoji?.description}.${imageExtensions[index]}`, blob);
		});

		const content = await zip.generateAsync({ type: "blob" });
		saveAs(content, `emoji-${emoji?.description}.zip`);
	}

	async downloadImg(emoji: EmojiInterface) {
		const path = `assets/emoji/png/${emoji?.unicode}.png`;

		const blob = await lastValueFrom(this.http.get(path, { responseType: "blob" }));
		saveAs(blob, `emoji-${emoji?.description}.png`);
	}
}
