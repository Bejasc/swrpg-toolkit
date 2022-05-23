import ContributorDirectoryVue from "@/views/Contributor Tools/ContributorDirectory.vue";
import ItemsDataSetVue from "@/views/Data Sets/ItemsDataSet.vue";
import LocationDataSetVue from "@/views/Data Sets/LocationDataSet.vue";
import { createRouter, createWebHistory } from "vue-router";
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
				// {
				// 	path: "packages",
				// 	name: "Content Creation",
				// 	component: ContentCreationVue, //async () => import("../views/Contributor Tools/ContentCreation.vue"),
				// },
				{
					path: "packages/item",
					name: "Item Package Creator",
					component: ItemPackageCreatorVue, //async () => import("../views/Contributor Tools/ItemPackageCreator.vue"),
				},
			],
		},
		{
			path: "/data",
			name: "Data",
			component: ContributorDirectoryVue, //async () => import("../views/Contributor Tools/ContributorDirectory.vue"),
			children: [
				{
					path: "locations",
					name: "Locations",
					component: LocationDataSetVue, //async () => import("../views/Contributor Tools/ContentCreation.vue"),
				},
				{
					path: "items",
					name: "Items",
					component: ItemsDataSetVue, //async () => import("../views/Contributor Tools/ContentCreation.vue"),
				},
				{
					path: "npcs",
					name: "NPCs",
					component: LocationDataSetVue, //async () => import("../views/Contributor Tools/ContentCreation.vue"),
				},
			],
		},
	],
});

export default router;
