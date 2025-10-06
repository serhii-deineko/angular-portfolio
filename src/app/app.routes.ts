import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { EmojiSeekerComponent } from "./app-emoji";

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent
	},
	{
		path: "emojiseeker",
		component: EmojiSeekerComponent
	},
	{
		path: "projects/:id",
		component: ProjectDetailComponent
	},
	{
		path: ":id",
		component: ProjectDetailComponent
	}
];
