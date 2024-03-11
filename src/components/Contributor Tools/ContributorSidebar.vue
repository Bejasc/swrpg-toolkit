<template>
	<v-navigation-drawer absolute :width="325">
		<v-img src="https://cdn.discordapp.com/attachments/743332978893258763/876449798306283600/492.jpg" cover></v-img>

		<v-list active-color="primary">
			<v-list-group v-for="group in listItems" v-show="group.isVisible">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props" :title="group.name" :prepend-icon="group.icon"></v-list-item>
				</template>

				<v-list-item
					density="compact"
					v-for="item in group.items"
					v-show="item.isVisible"
					:value="item.text"
					:title="item.text"
					v-on:click="item.click"
					:prepend-icon="item.icon"
				></v-list-item>
			</v-list-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang="ts">
import router from "@/router";

export default {
	name: "ContributorSidebar",
	data: () => {
		return {
			snackbar: false,
			snackbarMessage: "Tempoarily Disabled",

			listItems: [
				{
					name: "Existing Data",
					icon: "mdi-book-open-page-variant",
					isVisible: true,
					items: [
						{
							text: "Image Library",
							isVisible: true,
							icon: "mdi-image",
							click: function () {
								router.push({ path: "/data/event-images" });
							},
						},
						{
							text: "Items",
							isVisible: true,
							icon: "mdi-toolbox",
							click: function () {
								router.push({ path: "/data/items" });
							},
						},
						{
							text: "Locations",
							isVisible: true,
							icon: "mdi-earth",
							click: function () {
								router.push({ path: "/data/locations" });
							},
						},
					],
				},
				{
					name: "GM Tools",
					isVisible: true,
					icon: "mdi-dice-d20",
					items: [
						{
							text: "Difficulty Checks",
							isVisible: false,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Hook Builder",
							isVisible: true,
							click: function () {
								router.push({ path: "/tools/hook" });
							},
						}
					],
				},
				{
					name: "Package Creation",
					isVisible: true,
					icon: "mdi-package-variant",
					items: [
						{
							text: "About Packages",
							isVisible: true,
							icon: "mdi-help",
							click: function () {
								router.push({ path: "/contributor/packages/about" });
							},
						},
						{
							text: "Item Creator",
							isVisible: true,
							icon: "mdi-toolbox",
							click: function () {
								router.push({ path: "/contributor/packages/item" });
							},
						},
						{
							text: "Location Creator",
							isVisible: true,
							icon: "mdi-earth",
							click: function () {
								router.push({ path: "/contributor/packages/location" });
							},
						},
						{
							text: "Event Creator",
							isVisible: true,
							icon: "mdi-calendar-text",
							click: function () {
								router.push({ path: "/contributor/packages/event" });
							},
						},
					],
				},
			],
		};
	},
};
</script>
