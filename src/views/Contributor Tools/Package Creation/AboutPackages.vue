<template>
	<!--TODO: Pull this out into it's own component, define height of each item-->
	<v-card title="About Packages">
		<v-card-text>
			<h3>What is a Package?</h3>
			Packages can be thought of as 'mods' for any other game. <br />
			A package can contain Items, Locations, or Events (with other types coming soon). Here, you can use the tools and builders provided to create a package of any of the
			mentioned types.<br />
			Items, Events, and Locations are attributed in-game to the person who had created the package they were added in - so you'll always know who's created what.<br />
			For perfectionists, you can even load your existing Packages to continue working on them.
			<br />
			<br />
			<h3>How do they work?</h3>
			Packages work additively. The tool helps you to create JSON code that would normally be given to the Bot, to create entries into the database - you don't actually have
			to write or understand any code to make anything!<br />
			This gives power to the players to create whatever content they'd like to see in SWRPG.
			<br />
			<br />
			<h3>How can I see my Package in Game?</h3>
			To see your created packages in game, you'll need to save and export the Package, which can be done from within the tool you are using.<br />
			This will generate and download the JSON file, which you will then need to upload into the
			<a href="https://discord.com/channels/924640181913526303/985847677000507413">Submissions Channel</a>.<br />
			Once you have done this, the submission will be reviewed and approved, and can be quickly added to the database and circulated in-game.
			<br />
			<br />
			<h3>Warning</h3>
			<v-alert type="warning" class="ma-4" variant="outlined" prominent
				>All builders are Work-in-progress. Please note the following recomendations...<br />
				<ul>
					<li>- Avoid refreshing or navigating away from the page</li>
					<li>- Regularly save/export your event - even if not finished!</li>
				</ul>
			</v-alert>
			<br />
			<br />
			<!-- <LocationPicker @selection-changed="selectedLocationsChanged"></LocationPicker>
			{{ selectedLocations }} -->
			<h2>Get Started</h2>
			<v-row class="my-4">
				<FeatureImageCard v-for="section in sections" :cols="section.cols" :image="section.image" :text="section.text" :route="(section.route as string)" />
			</v-row>
		</v-card-text>
	</v-card>
</template>

<style scoped>
.imageMouseover {
	filter: brightness(100%) blur(0px);
	-webkit-transition: -webkit-filter 200ms linear;
}
.imageMouseover:hover {
	filter: brightness(90%) blur(1px);
	-webkit-transition: -webkit-filter 200ms linear;
}
</style>

<script lang="ts">
import ContributorSidebar from "@/components/Contributor Tools/ContributorSidebar.vue";
import FeatureImageCard from "@/components/FeatureImageCard.vue";
import LocationPicker from "@/components/LocationSelector.vue";
import { defineComponent } from "vue";
// Components

export default defineComponent({
	name: "ContentCreation",
	components: { ContributorSidebar, FeatureImageCard, LocationPicker },
	methods: {
		clicked(x: unknown) {
			console.log(x);
		},
		selectedLocationsChanged(newValue: string[]) {
			this.selectedLocations = newValue;
		},
	},
	data: () => {
		return {
			selectedLocations: [],
			sections: [
				{
					cols: 4,
					text: "Events",
					image: "https://cdn.bejasc.dev/swrpg/events/image084.png",
					route: "/contributor/packages/event",
				},
				{
					cols: 4,
					text: "Items",
					image: "https://cdn.bejasc.dev/swrpg/events/image1020.png",
					route: "/contributor/packages/item",
				},

				// { cols: 6, text: "Ships", image: "https://cdn.discordapp.com/attachments/743332978893258763/876450001490956288/525.jpg" },
				{
					cols: 4,
					text: "Locations",
					image: "https://cdn.bejasc.dev/swrpg/events/image127.png",
					route: "/contributor/packages/location",
				},
			],
		};
	},
});
</script>
