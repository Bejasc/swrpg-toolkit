<template>
	<v-col :cols="cols" @click="clicked()">
		<div style="position: relative; height: 250px">
			<div style="position: absolute; z-index: 100" class="text-h6 ma-3">{{ text }}</div>
			<v-parallax cover class="imageMouseover rounded-lg elevation-12" :src="image"> </v-parallax>
		</div>
	</v-col>
</template>

<style scoped>
.imageMouseover:not(norm) {
	filter: brightness(100%) blur(0px);
	-webkit-transition: -webkit-filter 200ms linear;
}
.imageMouseover:hover:not(norm) {
	cursor: pointer;

	filter: brightness(90%) blur(1px);
	-webkit-transition: -webkit-filter 200ms linear;
}
</style>

<script lang="ts">
import router from "@/router";
import { defineComponent } from "vue";
export default defineComponent({
	name: "FeatureImageCard",
	methods: {
		clicked() {
			if (this.route) {
				router.push(this.route);
			} else {
				alert("Coming Soon - Work in Progress");
			}
		},
	},
	props: {
		cols: {
			type: Number,
			default: 6,
		},
		image: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		route: String,
	},
});
</script>
