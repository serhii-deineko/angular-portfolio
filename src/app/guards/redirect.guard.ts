import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";

export const RedirectGuard: CanActivateFn = (route) => {
	const router = inject(Router);
	const path = route.routeConfig?.path;

	const anchorMap: Record<string, string> = {
		about: "about",
		projects: "projects",
		experience: "experience",
		contact: "contact"
	};

	const anchor = anchorMap[path || ""];

	if (anchor) {
		router.navigate(["/"], { fragment: anchor });
		return false;
	}

	return true;
};
