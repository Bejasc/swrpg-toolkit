<template>
	<v-dialog v-model="show" :fullscreen="fullScreen">
		<v-card>
			<v-card-title>
				<v-col>
					<v-row>
						{{ eventData.embedOptions.title }}
						<v-spacer />
						<v-btn icon dark @click="toggleFullScreen()">
							<v-icon>mdi-overscan</v-icon>
						</v-btn>
					</v-row>
				</v-col>
			</v-card-title>

			<v-card-text class="d-flex fill-height">
				<v-row>
					<v-col cols="3" v-if="fullScreen" class="d-flex flex-column overflow-auto fill-height">
						<v-container>
							<EventTree :base-event="props.eventData"></EventTree>
						</v-container>
					</v-col>

					<v-divider thickness="2" inset vertical></v-divider>

					<v-col class="d-flex flex-column overflow-auto fill-height">
						<EventEditor
							:allow-edit="allowEdit"
							:event-data="eventData"
							:is-top-level="true"
							:all-items="items"
							:all-locations="locations"
							:helper="helpers"
						></EventEditor>
					</v-col>
				</v-row>
			</v-card-text>

			<v-card-actions>
				<small style="opacity: 0.2">Event ID: {{ eventData.id }}</small>

				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
				<v-btn v-if="allowEdit" color="green darken-1" :disabled="!eventData.embedOptions.title" text @click="saveEvent()"> Save </v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
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
	import EventTree from "@/components/Contributor Tools/Events/EventTree.vue";
	import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
	import { getData } from "@/plugins/MongoConnector";
	import { getMatchingLocation, IItem, ILocation } from "@/types/SwrpgTypes";
	import type { IEventBase, IEventHelper } from "@/types/SwrpgTypes/IEventBase";
	import { defineComponent, onMounted, reactive, Ref, ref, watch, type PropType } from "vue";
	import { useStore } from "vuex";
	const store = useStore();

	const props = defineProps<{
		show: boolean;
		allowEdit: boolean;
		eventData: IEventBase;
	}>();

	const fullScreen = ref(false);

	function toggleFullScreen() {
		fullScreen.value = !fullScreen.value;
	}

	const items: Ref<IItem[]> = ref([]);
	const locations: Ref<ILocation[]> = ref([]);

	const emit = defineEmits(["eventSaved"]);

	async function saveEvent() {
		emit("eventSaved", props.eventData);
	}

	async function loadAllItems() {
		store.dispatch("showLoader", true);
		items.value = [];
		items.value = await getData<IItem>("item");

		store.dispatch("showLoader", false);
	}
	async function loadAllLocations() {
		store.dispatch("showLoader", true);
		locations.value = [];
		locations.value = await getData<ILocation>("location");

		store.dispatch("showLoader", false);
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
