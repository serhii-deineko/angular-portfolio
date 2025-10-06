import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "url",
	standalone: true
})
export class UrlPipe implements PipeTransform {
	transform(value: string, format: string): string {
		if (format === "png" || format === "webp") {
			return `assets/emoji/${format}/${value}.${format}`;
		} else {
			return value + format;
		}
	}
}
