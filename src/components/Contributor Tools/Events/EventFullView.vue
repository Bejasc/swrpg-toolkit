<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200">
			<v-card width="1200px" max-height="800px" :title="eventData.embedOptions.title">
				<v-card-text style="max-height: 80vh" class="mx-3 overflow-y-auto"> </v-card-text>
				<EventEditor :allow-edit="allowEdit" :event-data="eventData" :is-top-level="true" :all-items="items" :all-locations="locations" :helper="helpers"></EventEditor>
				<v-card-actions>
					<small style="opacity: 0.2">Event ID: {{ eventData.id }}</small>

					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
					<v-btn v-if="allowEdit" color="green darken-1" :disabled="!eventData.embedOptions.title" text @click="saveEvent()"> Save </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<style scoped>
.itemThumbnail {
	object-fit: contain;
	object-position: center;
	margin: 0 auto;
}

a {
	color: red;
	text-decoration: underline;
	font-style: normal;
	font-weight: bold;
}
</style>

<script setup lang="ts">
import EventEditor from "@/components/Contributor Tools/Events/EventEditor.vue";
import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
import { getData } from "@/plugins/MongoConnector";
import { mainPropertyStore } from "@/stores/CommonStore";
import { getMatchingLocation, IItem, ILocation } from "@/types/SwrpgTypes";
import type { IEventBase, IEventHelper } from "@/types/SwrpgTypes/IEventBase";
import { defineComponent, onMounted, reactive, Ref, ref, watch, type PropType } from "vue";

const props = defineProps<{
	show: boolean;
	allowEdit: boolean;
	eventData: IEventBase;
}>();

const items: Ref<IItem[]> = ref([]);
const locations: Ref<ILocation[]> = ref([]);

const emit = defineEmits(["eventSaved"]);

const mainStore = mainPropertyStore();

async function saveEvent() {
	emit("eventSaved", props.eventData);
}

async function loadAllItems() {
	mainStore.showLoader(true);
	items.value = [];
	items.value = await getData<IItem>("item");

	mainStore.showLoader(false);
}
async function loadAllLocations() {
	mainStore.showLoader(true);

	locations.value = [];
	locations.value = await getData<ILocation>("location");

	mainStore.showLoader(false);
}

onMounted(() => {
	loadAllItems();
	loadAllLocations();
});

const initialState: IEventHelper = {
	locationMode: "whitelist",
	locationValues: [],
	spawnEverywhere: true,
};

const helpers = reactive({ ...initialState });

function setHelper() {
	const newState: IEventHelper = initialState;
	if (props.eventData.circulationOptions.locationOptions) {
		if (props.eventData.circulationOptions.locationOptions.values.length > 0) {
			newState.spawnEverywhere = false;

			newState.locationMode = "whitelist";
			newState.locationValues = props.eventData.circulationOptions.locationOptions.values;

			newState.locationValues = newState.locationValues.map((e) => {
				const location = getMatchingLocation(e, locations.value);
				if (e != location._id) console.log(`Event ${props.eventData.id} provided ${e} as a trade location. Overriding to ID based value instead. ${location._id}`);
				return location._id;
			});
		} else {
			newState.spawnEverywhere = true;
		}
	}

	Object.assign(helpers, JSON.parse(JSON.stringify(newState)));
}

watch(
	() => props.eventData?.id,
	(newVal, oldVal) => {
		setHelper();
	},
);
</script>
