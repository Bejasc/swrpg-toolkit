<template>
	<v-card class="ma-1 pa-2" outlined flat style="cursor: pointer">
		<v-row no-gutters style="flex-wrap: nowrap" @click="checked = !checked">
			<v-col cols="3" class="flex-grow-0 flex-shrink-0">
				<div style="display: flex; align-items: center; height: 100%">
					<!-- <img :src="image" style="max-height: 60px" /> -->
					<v-img :src="image"></v-img>
				</div>
			</v-col>
			<v-col cols="7" style="min-width: 100px; max-width: 80%" class="pl-4 flex-gorw-1 flex-shrink-0">
				<div style="display: flex; align-items: center; height: 100%">
					{{ title }}
				</div>
			</v-col>
			<v-col cols="1">
				<v-checkbox v-model="checked" hide-details> </v-checkbox>
			</v-col>
		</v-row>
	</v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	initiallyChecked: {
		type: Boolean,
		default: false,
	},
});
const checked = ref(props.initiallyChecked);

const emit = defineEmits(["checkToggled"]);

watch(checked, () => {
	emit("checkToggled", props.id, checked.value);
});
</script>
