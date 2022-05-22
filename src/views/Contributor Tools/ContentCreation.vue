<template>
	<!--TODO: Pull this out into it's own component, define height of each item-->
	<v-row>
		<FeatureImageCard v-for="section in sections" :cols="section.cols" :image="section.image" :text="section.text" :route="(section.route as string)" />
	</v-row>
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
import { defineComponent } from "vue";
import ContributorSidebar from "../../components/Contributor Tools/ContributorSidebar.vue";
import FeatureImageCard from "../../components/FeatureImageCard.vue";

// Components

export default defineComponent({
	name: "ContentCreation",
	components: { ContributorSidebar, FeatureImageCard },
	methods: {
		clicked(x: unknown) {
			console.log(x);
		},
	},
	data: () => {
		return {
			sections: [
				{
					cols: 12,
					text: "Items",
					image: "https://cdn.discordapp.com/attachments/964554539539771412/975238642173902879/unknown.png",
					route: "/contributor/packages/item",
				},
				{ cols: 6, text: "Ships", image: "https://cdn.discordapp.com/attachments/743332978893258763/876450001490956288/525.jpg" },
				{ cols: 6, text: "Locations", image: "https://cdn.discordapp.com/attachments/743332978893258763/876449563504955452/459.jpg" },
			],
		};
	},
});
</script>
