<template>
	<v-navigation-drawer absolute :width="325">
		<v-parallax src="https://cdn.discordapp.com/attachments/743332978893258763/876449798306283600/492.jpg"></v-parallax>

		<v-list active-color="primary" variant="contained">
			<v-list-group v-for="group in listItems" v-show="group.isVisible">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props" :title="group.name" :prepend-icon="group.icon"></v-list-item>
				</template>

				<v-list-item v-for="item in group.items" v-show="item.isVisible" :value="item.text" :title="item.text" v-on:click="item.click"></v-list-item>
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
					name: "Data Sets (SWRPG V1)",
					icon: "mdi-book-open-page-variant",
					isVisible: true,
					items: [
						{
							text: "Items",
							isVisible: true,
							click: function () {
								router.push({ path: "/data/items" });
							},
						},
						{
							text: "NPCs",
							isVisible: false,
							click: function () {
								alert("Coming soon!");
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Locations",
							isVisible: true,
							click: function () {
								router.push({ path: "/data/locations" });
							},
						},
					],
				},
				{
					name: "GM Tools",
					isVisible: false,
					icon: "mdi-dice-d20",
					items: [
						{
							text: "Difficulty Checks",
							isVisible: true,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Hook Builder",
							isVisible: true,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
					],
				},
				{
					name: "Content Creation",
					isVisible: true,
					icon: "mdi-package-variant",
					items: [
						{
							text: "Package Creator",
							isVisible: true,
							click: function () {
								router.push({ path: "/contributor/packages" });
							},
						},
						{
							text: "Event Builder",
							isVisible: false,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Image Library",
							isVisible: false,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
					],
				},
			],
		};
	},
};
</script>
