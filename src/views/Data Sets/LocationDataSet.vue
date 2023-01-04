<template>
	<v-col cols="11">
		<v-text-field dense v-model="search" clearable label="Search" prepend-inner-icon="mdi-magnify" single-line></v-text-field>
		<v-row no-gutters style="max-height: 70vh" class="overflow-y-auto">
			<v-col v-for="loc in filteredItems" :key="loc.name" cols="3">
				<v-card class="ma-4">
					<v-img class="imageMouseover" :src="loc.image" :lazy-src="loc.image" cover height="196px">
						<div class="ma-4" style="height: 64px; width: 64px">
							<v-img style="margin-left: 0" :src="loc.planetImage" :lazy-src="loc.planetImage" contain> </v-img>
						</div>
					</v-img>
					<v-card-title class="text-h6 d-inline-block text-truncate" style="max-width: 100%">
						{{ loc.name }}
					</v-card-title>

					<v-card-subtitle>
						{{ loc.landingSite }}
						<v-spacer />
					</v-card-subtitle>
				</v-card>
			</v-col>
		</v-row>
	</v-col>
	<DrpgLoader :showLoader="showLoader" />
</template>

<style scoped>
.imageMouseover {
	filter: brightness(100%) blur(0.5px);
	-webkit-transition: -webkit-filter 200ms linear;
}
.imageMouseover:hover {
	cursor: pointer;

	filter: brightness(115%) blur(0px);
	-webkit-transition: -webkit-filter 200ms linear;
}
</style>

<script lang="ts">
import DrpgLoader from "@/components/DrpgLoader.vue";
import { getData } from "@/plugins/MongoConnector";
import type { ILocation } from "@/types/SwrpgTypes/ILocation";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "LocationDataSet",
	components: { DrpgLoader },
	emits: ["pageNavigation"],
	data: () => {
		return {
			search: "",
			showLoader: false,
			locations: [] as ILocation[],
		};
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);

		this.loadAllItems();
	},
	methods: {
		async loadAllItems() {
			this.showLoader = true;
			this.locations = [];
			this.locations = await getData<ILocation>("location");

			console.table(this.locations);
			this.showLoader = false;
		},
	},
	computed: {
		filteredItems(): ILocation[] {
			return this.locations.filter((location: ILocation) => {
				return location.name.toLowerCase().includes(this.search.toLowerCase()) || location.aliases?.some((e) => e.toLowerCase().includes(this.search.toLowerCase()));
				//return npc.tags.some(t => t.toLowerCase().includes(this.search.toLowerCase()));
			});
		},
	},
});
</script>
