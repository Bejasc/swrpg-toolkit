<template>
	<v-overlay v-model="showLoader" scrim="black" class="align-center justify-center">
		<div class="d-flex flex-column fill-height justify-center align-center text-white">
			<v-progress-circular :size="50" color="amber" indeterminate> </v-progress-circular>
			<div class="ma-6">
				{{ randomLoadMessage }}
			</div>
		</div>
	</v-overlay>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import loadMessages from "@/data/loadMessages.json";
import { ComputedRef, computed, watch, ref } from "vue";

const store = useStore();

const showLoader: ComputedRef<boolean> = computed((): boolean => store.state.showLoader);

const randomLoadMessage = ref("");
const rOpts = loadMessages as string[];

watch(showLoader, () => {
	if (showLoader.value == true) {
		const rnd = rOpts[Math.floor(Math.random() * rOpts.length)];
		randomLoadMessage.value = rnd;
		console.log(randomLoadMessage);
	} else {
		randomLoadMessage.value = "";
	}
});
</script>
