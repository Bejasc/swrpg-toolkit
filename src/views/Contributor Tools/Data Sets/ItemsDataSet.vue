<template>
	<v-col cols="11">
		<v-text-field dense v-model="search" clearable label="Search" prepend-inner-icon="mdi-magnify" single-line></v-text-field>
		<v-row no-gutters style="max-height: 70vh" class="overflow-y-auto">
			<v-col v-for="item in filteredItems" :key="item._id" cols="2">
				<v-card class="ma-4" @click="openItemFullView(item)">
					<v-img class="imageMouseover" :src="item.image" :lazy-src="item.image" contain height="150px"> </v-img>
					<v-card-title class="text-subtitle-1 d-inline-block text-truncate" style="max-width: 100%">
						{{ item.name }}
					</v-card-title>

					<v-card-subtitle>
						{{ item.category }}
					</v-card-subtitle>
				</v-card>
			</v-col>
		</v-row>
	</v-col>
	<ItemFullView :show="dialogItemFullView" :item="selectedItem" :allowEdit="false" @closeFullView="dialogItemFullView = false" />
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
import ItemFullView from "@/components/Contributor Tools/ItemFullView.vue";
import { getData } from "@/plugins/MongoConnector";
import { IItem } from "@/types/SwrpgTypes/Item";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "LocationDataSet",
	components: { ItemFullView },
	emits: ["pageNavigation"],
	data: () => {
		return {
			selectedItem: {} as IItem,
			dialogItemFullView: false,
			search: "",
			items: [] as IItem[],
		};
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);

		this.loadAllItems();
	},
	methods: {
		async loadAllItems() {
			this.$store.dispatch("showLoader", true);
			this.items = [];
			this.items = await getData<IItem>("item");

			console.table(this.items);
			this.$store.dispatch("showLoader", false);
		},
		openItemFullView(item: IItem) {
			this.selectedItem = item;
			this.dialogItemFullView = true;
		},
	},
	computed: {
		filteredItems(): IItem[] {
			return this.items.filter((item: IItem) => {
				return item.name.toLowerCase().includes(this.search.toLowerCase()) || item.aliases?.some((e) => e.toLowerCase().includes(this.search.toLowerCase()));
				//return npc.tags.some(t => t.toLowerCase().includes(this.search.toLowerCase()));
			});
		},
	},
});
</script>
