/* Angular */
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	standalone: true,
	selector: "app-router",
	imports: [RouterOutlet],
	templateUrl: "./router.component.html",
})
export class RouterComponent {}
