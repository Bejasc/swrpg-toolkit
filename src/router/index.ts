import ContributorDirectoryVue from "@/views/Contributor Tools/ContributorDirectory.vue";
import LocationDataSetVue from "@/views/Data Sets/LocationDataSet.vue";
import { createRouter, createWebHistory } from "vue-router";
import ContentCreationVue from "../views/Contributor Tools/ContentCreation.vue";
import ItemPackageCreatorVue from "../views/Contributor Tools/ItemPackageCreator.vue";
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
			component: ContributorDirectoryVue, //async () => import("../views/Contributor Tools/ContributorDirectory.vue"),
			children: [
				{
					path: "data/locations",
					name: "Locations",
					component: LocationDataSetVue, //async () => import("../views/Contributor Tools/ContentCreation.vue"),
				},
				{
					path: "packages",
					name: "Content Creation",
					component: ContentCreationVue, //async () => import("../views/Contributor Tools/ContentCreation.vue"),
				},
				{
					path: "packages/item",
					name: "Item Package Creator",
					component: ItemPackageCreatorVue, //async () => import("../views/Contributor Tools/ItemPackageCreator.vue"),
				},
			],
		},
	],
});

export default router;
