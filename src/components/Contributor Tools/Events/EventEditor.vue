<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel title="Circulation Options" v-if="isTopLevel">
			<v-expansion-panel-text>
				<v-row no-gutters>
					<v-select label="Frequency" :items="frequencies" v-model="eventData.circulationOptions.frequency" variant="solo"></v-select>
				</v-row>
				<v-row no-gutters>
					<v-checkbox
						v-model="props.helper.spawnEverywhere"
						:label="`Spawn Everywhere: ${props.helper.spawnEverywhere ? 'Yes' : 'No'}`"
						:readonly="!allowEdit"
						@update:focused="availableEverywhereChanged"
						v-if="allowEdit == true"
					></v-checkbox>
					<v-radio-group inline v-if="!props.helper.spawnEverywhere && allowEdit == true" v-model="props.helper.locationMode" :readonly="!allowEdit">
						<v-radio label="Whitelist" value="whitelist"></v-radio>
						<v-radio label="Blacklist" value="blacklist"></v-radio>
					</v-radio-group>
				</v-row>
				<p class="text-caption" v-if="allowEdit">{{ eventSpawnHelperText }}</p>
				<v-alert density="compact" type="info" variant="outlined" v-else>
					{{ eventSpawnHelperText }}
				</v-alert>
				<v-col cols="12" v-if="!props.helper.spawnEverywhere && allowEdit == true">
					<LocationPicker :selected-values="props.helper.locationValues" @selection-changed="selectedLocationsChanged"></LocationPicker>
				</v-col>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Embed Options">
			<v-expansion-panel-text>
				<v-row no-gutters>
					<v-col cols="6">
						<v-text-field
							label="Embed Title"
							:readonly="!allowEdit"
							v-model="eventData.embedOptions.title"
							density="compact"
							placeholder="Dropped Credits"
							required
						></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-color-picker
							v-model="eventData.embedOptions.color"
							show-swatches
							hide-canvas
							hide-inputs
							hide-sliders
							width="600"
							elevation="0"
							:swatches="swatches"
						></v-color-picker>
					</v-col>
					<v-col cols="12">
						<v-textarea
							v-model="eventData.embedOptions.description"
							:readonly="!allowEdit"
							label="Description"
							required
							rows="2"
							placeholder="You find some credits on the ground..."
						></v-textarea>
						<v-text-field label="Thumbnail" :readonly="!allowEdit" v-model="eventData.embedOptions.thumbnail" density="compact"></v-text-field>
						<v-text-field label="Image" :readonly="!allowEdit" v-model="eventData.embedOptions.image" density="compact"></v-text-field>
					</v-col>
				</v-row>

				<v-btn color="primary" dark @click.stop="previewEmbed = true"> Preview Embed </v-btn>
				<v-dialog v-model="previewEmbed" width="360" min-width="360">
					<DiscordEmbed
						:title="eventData.embedOptions.title"
						:image="eventData.embedOptions.image"
						:thumbnail="eventData.embedOptions.thumbnail"
						:color="eventData.embedOptions.color"
					>
						{{ eventData.embedOptions.description }}</DiscordEmbed
					>
				</v-dialog>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Requirements and Conditions">
			<v-expansion-panel-text>
				<div align="left" class="text-caption font-italic text-medium-emphasis ma-4" v-if="isTopLevel">
					Requirements can be set fo revents. This can be a simple requirement, or, several detailed requirements where any or all conditions must be met.<br />
					When entering *this node* of an event, if a condition(s) is not met, the onFail event will trigger, instead of continuing to the EventLinks.. <br />
					<strong>In most cases, you will want a single Condition, with a single Subcondition, e.g for "Player has 100 credits".</strong>. <br />Conditions can be "named"
					so you can manage them a little easier. This has no in-game affect.
				</div>
				<v-row no-gutters>
					<v-col cols="2">
						<v-select v-if="eventData.requirements" label="Match Strategy" :items="matchStrategies" v-model="eventData.requirements.match" variant="solo"></v-select>
					</v-col>
				</v-row>

				<br />
				<template v-if="eventData.requirements">
					<EventCondition :allow-edit="allowEdit" :event="eventData" :remove-condition="removeCondition" :items="allItems" :locations="allLocations"></EventCondition>
				</template>

				<v-col cols="1" class="ma-3">
					<v-btn color="blue" variant="text" @click="addCondition()">Add Condition</v-btn>
				</v-col>
				<template v-if="eventData.requirements">
					<v-expansion-panels variant="accordion">
						<v-expansion-panel title="Event - On Fail" color="red-darken-4">
							<v-expansion-panel-text>
								<EventEditorComponent
									:eventData="eventData.requirements.failEvent"
									:allowEdit="allowEdit"
									:allItems="allItems"
									:allLocations="allLocations"
								></EventEditorComponent>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</template>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Results">
			<v-expansion-panel-text>
				<div align="left" class="text-caption font-italic text-medium-emphasis ma-4" v-if="isTopLevel">
					Results are the affects that are applied to the player when this node of the Event is hit. <br />
					They could be awarded or penalized Credits, Skill Points or Items, or something else.
					<span v-if="eventData.results?.changes.some((e) => e.type === 'item')"
						><br />
						<br />Not seeing an Item you want? Head to the Item Creator to create the item and have it added!</span
					>
				</div>
				<div v-if="eventData.results">
					<EventResult
						:allow-edit="allowEdit"
						v-for="result in eventData.results.changes"
						:event-result="result"
						:remove-result="removeResult"
						:all-items="allItems"
					></EventResult>
				</div>
				<v-row>
					<v-col cols="1" class="ma-3">
						<v-btn color="green" variant="text" @click="addResult()">Add Result</v-btn>
					</v-col>
					<v-col cols="4">
						<v-checkbox v-if="eventData.results?.changes.length > 1" v-model="eventData.results.pickRandom" label="Pick one at random"></v-checkbox>
					</v-col>
				</v-row>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel>
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					<v-row no-gutters>
						<v-col cols="4" class="d-flex justify-start"> Event Links </v-col>
					</v-row>
				</template>
			</v-expansion-panel-title>
			<v-expansion-panel-text>
				<div align="left" class="text-caption font-italic text-medium-emphasis ma-4" v-if="isTopLevel">
					For each entry, a Button will be shown for that entry as an available choice. For each choice, multiple events can be provided - one will be picked at random.
					<br />
					If no link is provided - this event ({{ eventData.embedOptions.title }}) will be considered as the conclusion.
				</div>
				<div v-if="eventData.eventLinks">
					<EventLinkComponent
						:allow-edit="allowEdit"
						:event-link="eventLink"
						v-for="(eventLink, index) in eventData.eventLinks"
						:key="index"
						:remove-event-link="removeEventLink"
						:all-items="allItems"
					></EventLinkComponent>
				</div>

				<div class="text-center mt-5">
					<v-btn class="ma-2" icon="mdi-plus" size="small" variant="outlined" color="green" @click="addEventLink"> </v-btn>
				</div>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
import { joinString } from "@/plugins/Utils";
import DrpgSwatches from "@/types/DrpgColors";
import { getMatchingLocation, IItem, ILocation } from "@/types/SwrpgTypes";
import { DEFAULT_EVENT_STATE, IEventBase, IEventCondition, IEventHelper, IEventLink, IEventResult, IEventSubCondition } from "@/types/SwrpgTypes/IEventBase";
import { computed, onMounted, reactive, ref, Ref, watch } from "vue";
import EventCondition from "./EventCondition.vue";
import EventResult from "./EventResult.vue";
import LocationPicker from "@/components/LocationSelector.vue";

const props = defineProps<{
	eventData: IEventBase;
	allowEdit: boolean;
	isTopLevel: boolean;
	allItems: IItem[];
	allLocations: ILocation[];
	helper: IEventHelper;
}>();

const swatches = DrpgSwatches;
const matchStrategies = ["All of", "Any of", "None of"];
const frequencies = ["Common", "Regular", "Uncommon", "Rare", "Legendary"];

const previewEmbed: Ref<boolean> = ref(false);

function availableEverywhereChanged() {
	if (props.helper.spawnEverywhere) delete props.eventData.circulationOptions.locationOptions;
	else {
		props.eventData.circulationOptions.locationOptions = {
			type: props.helper.locationMode,
			values: props.helper.locationValues,
		};
	}
}

function addEventLink() {
	if (!props.eventData.eventLinks) props.eventData.eventLinks = [];

	const newLink: IEventLink = {
		title: null,
		event: [JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE()))],
	};
	props.eventData.eventLinks.push(newLink);
}

function removeEventLink(eventLink: IEventLink) {
	props.eventData.eventLinks = props.eventData.eventLinks.filter((e) => e != eventLink);
	if (props.eventData.eventLinks.length === 0) delete props.eventData.eventLinks;
}

function addResult() {
	if (!props.eventData.results) props.eventData.results = { pickRandom: false, changes: [] };

	const newResult: IEventResult = {
		modifier: "add",
		type: "item",
		key: null,
		value: null,
	};

	props.eventData.results.changes.push(newResult);
}

function removeResult(result: IEventResult) {
	props.eventData.results.changes = props.eventData.results.changes.filter((e) => e != result);
	if (props.eventData.results.changes.length == 0) delete props.eventData.results;
}

function addCondition() {
	if (!props.eventData.requirements) {
		props.eventData.requirements = {
			match: "All of",
			conditions: [],
			failEvent: JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE())),
		};
	}

	const newCondition: IEventCondition = {
		identifier: "New Condition",
		match: "All of",
		subConditions: [],
	};

	props.eventData.requirements.conditions.push(newCondition);
}

function removeCondition(condition: IEventCondition) {
	props.eventData.requirements.conditions = props.eventData.requirements.conditions.filter((e) => e != condition);
	if (props.eventData.requirements.conditions.length == 0) delete props.eventData.requirements;
	//If requirement object contains no definitions, delete it from thing
	//if (props.eventData.requirements.changes.length == 0) delete props.eventData.results;
}

function selectedLocationsChanged(newValue?: string[]) {
	props.helper.locationValues = newValue;
	props.eventData.circulationOptions.locationOptions.values = newValue;
}

const eventSpawnHelperText = computed(() => {
	const title = props.eventData.embedOptions.title;
	const frequency = props.eventData.circulationOptions.frequency;

	const matchingLocations = props.allLocations.filter((e) => props.helper.locationValues.includes(e._id));
	const matchingLocationNames = joinString(matchingLocations.map((e) => e.name));

	if (props.helper.spawnEverywhere) {
		return `${title} will spawn ${frequency} everywhere.`;
	} else {
		if (props.helper.locationValues.length == 0) return "Make a selection to continue";

		if (props.helper.locationMode === "whitelist") {
			return `${title} will *ONLY* spawn ${frequency} on ${matchingLocationNames}.`;
		} else {
			return `${title} will spawn ${frequency} everywhere *EXCEPT* on ${matchingLocationNames}`;
		}
	}
});
</script>
