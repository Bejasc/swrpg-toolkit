<template>
	<v-card color="grey-darken-3" flat tile>
		<v-card-title>
			<v-row class="ma-1" style="max-height: 35px">
				<v-col cols="6" class="pa-0">
					<v-text-field class="text-caption" v-model="search" variant="underlined" density="compact" placeholder="Search Locations..."></v-text-field>
				</v-col>
				<v-spacer></v-spacer>
				<v-col class="pa-0">
					<v-checkbox hide-details label="Select All"></v-checkbox>
				</v-col>
			</v-row>
		</v-card-title>
		<v-row style="max-height: 250px" class="mx-2 mb-3 overflow-y-auto" no-gutters>
			<v-col cols="3" v-if="filteredLocations.length > 0" v-for="loc in filteredLocations" :key="loc._id">
				<SmallEntityCard :title="loc.name" :image="loc.planetImage" :id="loc._id" @check-toggled="checkToggled"></SmallEntityCard>
			</v-col>
			<p v-else>No Locations Found</p>
		</v-row>
	</v-card>
</template>

<script setup lang="ts">
//
//* This is the Composition API - what I should aim to use for all componenets.
//
import { getData } from "@/plugins/MongoConnector";
import { ILocation } from "@/types/SwrpgTypes";
import { computed, onMounted, PropType, ref, Ref, watch } from "vue";
import { useStore } from "vuex";
import SmallEntityCard from "./SmallEntityCard.vue";
const store = useStore();

const props = defineProps({
	title: {
		type: String,
		default: "Locations",
	},
	enableSearch: {
		type: Boolean,
		default: false,
	},
});

const search: Ref<string> = ref("");

const allLocations: Ref<ILocation[]> = ref();

const selection = ref([]);

onMounted(async () => {
	store.dispatch("showLoader", true);
	allLocations.value = await getData<ILocation>("location");
	store.dispatch("showLoader", false);
});

const filteredLocations = computed(() => {
	if (!allLocations.value) return [];
	return allLocations.value.filter((location: ILocation) => {
		return location.name.toLowerCase().includes(search.value.toLowerCase()) || location.aliases?.some((e) => e.toLowerCase().includes(search.value.toLowerCase()));
	});
});

const emit = defineEmits(["selectionChanged"]);

function checkToggled(id: string, checked: boolean) {
	if (checked) {
		selection.value.push(id);
	} else {
		selection.value = selection.value.filter((e) => e != id);
	}
	emit("selectionChanged", selection.value);
}
</script>
