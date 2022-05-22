<template>
	<v-overlay v-model="showLoader" scrim="black" class="align-center justify-center">
		<div class="d-flex flex-column fill-height justify-center align-center text-white">
			<v-progress-circular :size="50" color="amber" indeterminate> </v-progress-circular>
			<div class="ma-6">
				{{ randomLoadMessage() }}
			</div>
		</div>
	</v-overlay>
</template>

<script lang="ts">
import loadMessages from "@/data/loadMessages.json";
import { defineComponent } from "vue";
export default defineComponent({
	name: "DrpgLoader",
	props: {
		showLoader: {
			type: Boolean,
			required: true,
		},
	},
	methods: {
		randomLoadMessage() {
			const m = loadMessages as string[];

			const rnd = m[Math.floor(Math.random() * m.length)];
			return `${rnd}` ?? "Loading";
		},
	},
});
</script>
