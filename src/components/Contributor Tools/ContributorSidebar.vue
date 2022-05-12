<template>
	<v-navigation-drawer permanent>
		<v-parallax src="https://cdn.discordapp.com/attachments/743332978893258763/876449798306283600/492.jpg"></v-parallax>
		<v-list>
			<v-list-item prepend-icon="mdi-email" title="Inbox" value="inbox"></v-list-item>
			<v-list-item prepend-icon="mdi-account-supervisor-circle" title="Supervisors" value="supervisors"></v-list-item>
			<v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin"></v-list-item>
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
			datasets: [
				{
					text: "Items",
					click: function () {
						router.push({ path: "/data/items" });
					},
				},
				{
					text: "NPCs",
					click: function () {
						router.push({ path: "/data/npc" });
					},
				},
			],
			gmTools: [
				{
					text: "Hook Builder",
					icon: "mdi-hook",
					click: function () {
						router.push({ path: "/tools/hook" });
					},
				},
				// {
				// 	text: "Quest Item Creator",
				// 	icon: "mdi-map-marker-question",
				// 	click: function() {
				// 		router.push({ path: "/tools/item" });
				// 	},
				// },
				// {
				// 	text: "NPC Directory",
				// 	icon: "mdi-account",
				// 	click: function() {
				// 		router.push({ path: "/tools/npc" });
				// 	},
				// },
				{
					text: "Image Library",
					icon: "mdi-image",
					click: function () {
						alert("This item is tempoarily disabled");
						//router.push({ path: "/tools/images" });
					},
				},
			],
			contributorResources: [
				{
					text: "Event Builder",
					click: function () {
						router.push({ path: "/tools/eventBuilder" });
					},
				},
			],
			gmResources: [
				// { text: "Quest Item Creator", icon: "mdi-map-marker-question" },
				{
					text: "Difficulty Checks",
					click: function () {
						router.push({ path: "/tools/resources/difficultyChecks" });
					},
				},
				{
					text: "Event Images",
					click: function () {
						//router.push({ path: "/tools/resources/images" });
					},
				},
			],
		};
	},
};
</script>
