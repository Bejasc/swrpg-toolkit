import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Home",
			component: HomeView,
		},
		{
			path: "/contributor",
			name: "Contributor Tools",
			component: async () => import("../views/Contributor Tools/ContributorDirectory.vue"),
			children: [
				{
					path: "packages",
					name: "Content Creation",
					component: async () => import("../views/Contributor Tools/ContentCreation.vue"),
				},
				{
					path: "packages/item",
					name: "Item Package Creator",
					component: async () => import("../views/Contributor Tools/ItemPackageCreator.vue"),
				},
			],
		},
	],
});

export default router;
