<template>
	<v-col cols="11">
		<!-- <v-row>
			<v-col cols="10">
				<v-text-field dense v-model="search" clearable label="Search" prepend-inner-icon="mdi-magnify" single-line></v-text-field>
			</v-col>
			<v-col cols="2">
				<v-select
				:items="supportedSizes"
								v-model="selectedSize"
								item-title="title"
								item-value="title"
      label="Size"
    ></v-select>
			</v-col>
		</v-row> -->
		<v-row no-gutters class="overflow-y-auto">
			<v-col v-for="img in allImages" :key="img.url" :cols="selectedSize.cols">
				<v-card class="ma-2">
					<v-img class="imageMouseover" @click="showPreviewImage(img)" :src="img.url" :lazy-src="img.url" :height="selectedSize.height">

					</v-img>
				</v-card>
			</v-col>
		</v-row>
	</v-col>
	<v-snackbar v-model="snackbarClipboard" timeout="2500" color="green">URL copied to clipboard</v-snackbar>
	<v-dialog v-model="showPreview" transition="fade-transition" width="500">
		<v-img width="500" aspect-ratio="16/9" :src="previewImage"></v-img>
		<v-btn class="ma-4" color="blue" @click="copyUrl()">Copy URL</v-btn>
	</v-dialog>
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
.v-overlay--active {
    backdrop-filter: blur(2px);
    background: rgb(0 0 0 / 0.9);
}
</style>

<script setup lang="ts">
import axios, { all } from 'axios';
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

type SizeConfig = { title:string, cols:number, height:number}

const supportedSizes:SizeConfig[] = [
	{ title: "Tiny", cols:1, height:96 },
	{ title: "Small", cols:2, height:150 },
	{ title: "Medium", cols:3, height:196 },
];

const selectedSize: Ref<SizeConfig> = ref(supportedSizes.find(e=>e.title == "Small"));

const allImages: Ref<ImageData[]> = ref();

const showPreview: Ref<boolean> = ref(false);
const snackbarClipboard: Ref<boolean> = ref(false);

const previewImage: Ref<string> = ref("");

onMounted(async () => {
	store.dispatch("showLoader", true);
	allImages.value = await loadImages(20);
	store.dispatch("showLoader", false);
});

function showPreviewImage(image:ImageData){
	showPreview.value=true;
	previewImage.value=image.url;
}

function copyUrl(){
	snackbarClipboard.value = true;
	navigator.clipboard.writeText(previewImage.value);
	showPreview.value = false;
	previewImage.value = null;
	
}

async function loadImages(count:number):Promise<ImageData[]>{

	let url = `https://swrpg.bejasc.dev/api/v2/images`;

	console.log(url)
	
	const response = await axios({
		method: "get",
		url,
		headers: {
			"Content-Type": "application/json",
		},
	});

	const result: string[] = JSON.parse(JSON.stringify(response.data));

	return result.map(e=>new ImageData(e)).sort()//.slice(0,count);
}

</script>