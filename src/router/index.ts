import ContentCreationVue from "@/views/Contributor Tools/ContentCreation.vue";
import ContributorDirectoryVue from "@/views/Contributor Tools/ContributorDirectory.vue";
import ItemsDataSetVue from "@/views/Data Sets/ItemsDataSet.vue";
import LocationDataSetVue from "@/views/Data Sets/LocationDataSet.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import EventPackageCreator from "../views/Contributor Tools/EventPackageCreator.vue";
import ItemPackageCreatorVue from "../views/Contributor Tools/ItemPackageCreator.vue";
import LocationPackageCreator from "../views/Contributor Tools/LocationPackageCreator.vue";
import HomeView from "../views/HomeView.vue";
const router = createRouter({
	history: createWebHashHistory(),
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
					path: "packages/about",
					name: "About Contributing",
					component: ContentCreationVue, //async () => import("../views/Contributor Tools/ContributorDirectory.vue"),
				},
				{
					path: "packages/item",
					name: "Item Package Creator",
					component: ItemPackageCreatorVue, //async () => import("../views/Contributor Tools/ItemPackageCreator.vue"),
				},
				{
					path: "packages/location",
					name: "Location Package Creator",
					component: LocationPackageCreator, //async () => import("../views/Contributor Tools/ItemPackageCreator.vue"),
				},
				{
					path: "packages/event",
					name: "Event Package Creator",
					component: EventPackageCreator, //async () => import("../views/Contributor Tools/ItemPackageCreator.vue"),
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
