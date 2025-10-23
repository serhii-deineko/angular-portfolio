import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { EmojiSeekerComponent } from "./app-emoji";
import { RedirectGuard } from "./guards/redirect.guard";

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent
	},
	{
		path: "about",
		component: HomeComponent,
		canActivate: [RedirectGuard]
	},
	{
		path: "projects",
		component: HomeComponent,
		canActivate: [RedirectGuard]
	},
	{
		path: "experience",
		component: HomeComponent,
		canActivate: [RedirectGuard]
	},
	{
		path: "contact",
		component: HomeComponent,
		canActivate: [RedirectGuard]
	},
	{
		path: "emoji-seeker",
		component: EmojiSeekerComponent
	},
	{
		path: "projects/:id",
		component: ProjectDetailComponent
	},
	{
		path: ":id",
		component: ProjectDetailComponent
	},
	{
		path: "**",
		redirectTo: "",
		pathMatch: "full"
	}
];
