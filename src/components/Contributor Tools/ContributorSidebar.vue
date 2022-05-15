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
					name: "Data Sets",
					icon: "mdi-book-open-page-variant",
					isVisible: true,
					items: [
						{
							text: "Items",
							isVisible: true,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "NPCs",
							isVisible: false,
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Locations",
							isVisible: true,
							click: function () {
								console.warn(`Not Implemented`);
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
					name: "Contributor Tools",
					isVisible: true,
					icon: "mdi-package-variant",
					items: [
						{
							text: "Content Creation",
							isVisible: true,
							click: function () {
								router.push({ path: "/contributor/packages" });
							},
						},
						{
							text: "Event Builder",
							isVisible: true,
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
