<template>
	<v-navigation-drawer permanent :width="325">
		<v-parallax src="https://cdn.discordapp.com/attachments/743332978893258763/876449798306283600/492.jpg"></v-parallax>

		<v-list active-color="primary" variant="contained">
			<v-list-group v-for="group in listItems">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props" :title="group.name" :prepend-icon="group.icon"></v-list-item>
				</template>

				<v-list-item v-for="item in group.items" :value="item.text" :title="item.text" v-on:click="item.click"></v-list-item>
			</v-list-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang="ts">
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
					items: [
						{
							text: "Items",
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "NPCs",
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Locations",
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
					],
				},
				{
					name: "GM Tools",
					icon: "mdi-dice-d20",
					items: [
						{
							text: "Difficulty Checks",
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Hook Builder",
							icon: "mdi-hook",
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
					],
				},
				{
					name: "Contributor Resources",
					icon: "mdi-package-variant",
					items: [
						{
							text: "Event Builder",
							click: function () {
								console.warn(`Not Implemented`);
							},
						},
						{
							text: "Image Library",
							icon: "mdi-image",
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
