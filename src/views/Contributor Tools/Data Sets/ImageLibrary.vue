<template>
	<v-col cols="11">
		<v-text-field dense v-model="search" clearable label="Search" prepend-inner-icon="mdi-magnify" single-line></v-text-field>
		<v-row no-gutters style="max-height: 70vh" class="overflow-y-auto">
			<v-col v-for="img in allImages" :key="img.url" cols="3">
				<v-card class="ma-4">
					<v-img class="imageMouseover" :src="img.url" :lazy-src="img.url" cover height="196px">

					</v-img>
				</v-card>
			</v-col>
		</v-row>
	</v-col>
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

<script setup lang="ts">
import { all } from 'axios';
import { Ref, computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();


class ImageData {
	public url:string;

	public tags:string[] = [];
	public metadata:Map<string,string> = new Map();

	constructor(url:string){
		this.url = url;
	}
}

const search: Ref<string> = ref("");
const allImages: Ref<ImageData[]> = ref();

onMounted(async () => {
	store.dispatch("showLoader", true);
	allImages.value = await loadImages(20);
	store.dispatch("showLoader", false);
});

async function loadImages(count:number):Promise<ImageData[]>{
	//TODO actually iterate through Azure
	const result:ImageData[] = [];
	for(let i=0;i<count;i++){
		const key = String(i+1).padStart(3,'0');
		result.push(new ImageData(`https://cdn.bejasc.dev/swrpg/events/image${key}.png`))
	}

	return result;
}

</script>
<!-- 
<script lang="ts">
import { getData } from "@/plugins/MongoConnector";
import { ILocation } from "@/types/SwrpgTypes";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "ImageLibrary",
	emits: ["pageNavigation"],
	data: () => {
		return {
			search: "",
			showLoader: false,
			images: [] as string[],
		};
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);

		this.loadAllItems();
	},
	methods: {
		async loadAllItems() {
			this.$store.dispatch("showLoader", true);
			this.locations = [];
			this.locations = await getData<ILocation>("location");

			console.table(this.locations);
			this.$store.dispatch("showLoader", false);
		},
	},
	computed: {
		filteredItems(): ILocation[] {
			return this.locations.filter((location: ILocation) => {
				return location.name.toLowerCase().includes(this.search.toLowerCase()) || location.aliases?.some((e) => e.toLowerCase().includes(this.search.toLowerCase()));
			});
		},
	},
});
</script> -->
import { ILocation } from '@/types/SwrpgTypes';
import { Ref, ref } from 'vue';

