<template>
	<v-expansion-panels variant="accordion">
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
		<v-expansion-panel title="Conditions">
			<v-expansion-panel-text>
				<div align="left" class="text-caption font-italic text-medium-emphasis ma-4" v-if="isTopLevel">
					Conditions can be set for events.<br />
					When entering *this node* of an event, if the condition is not met, the onFail event will trigger, instead of continuing to the EventLinks..
				</div>
				<v-select v-if="eventData.requirements" label="Match Strategy" :items="matchStrategies" v-model="eventData.requirements.match" variant="solo"></v-select>

				<div class="mx-3 mt-3">
					<p class="text-h6">Conditions</p>
					<v-btn color="blue" variant="outlined" @click="addCondition()">Add Condition</v-btn>
				</div>
				<br />
				<div v-if="eventData.requirements">
					<EventCondition
						:allow-edit="allowEdit"
						v-for="condition in eventData.requirements.conditions"
						:condition="condition"
						:remove-condition="removeCondition"
						:items="allItems"
					></EventCondition>

					<v-expansion-panels variant="accordion">
						<v-expansion-panel title="Event - On Fail" color="red-darken-4">
							<v-expansion-panel-text>
								<EventEditorComponent :eventData="eventData.requirements.failEvent" :allowEdit="allowEdit" :allItems="allItems"></EventEditorComponent>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
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

<script lang="ts">
import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
import DrpgSwatches from "@/types/DrpgColors";
import { IItem } from "@/types/SwrpgTypes";
import { DEFAULT_EVENT_STATE, IEventBase, IEventCondition, IEventLink, IEventResult } from "@/types/SwrpgTypes/IEventBase";
import { defineComponent, type PropType } from "vue";
import EventCondition from "./EventCondition.vue";
import EventResult from "./EventResult.vue";
export default defineComponent({
	name: "EventEditor",
	components: { DiscordEmbed, EventResult, EventCondition },
	props: {
		eventData: {
			type: Object as PropType<IEventBase>,
			required: true,
		},
		allowEdit: Boolean,
		isTopLevel: {
			type: Boolean,
			default: false,
		},
		allItems: {
			type: Object as PropType<IItem[]>,
			required: true,
		},
	},
	data: () => {
		return {
			previewEmbed: false,
			swatches: DrpgSwatches,
			matchStrategies: ["All of", "One of", "None of"],
		};
	},
	methods: {
		async saveEvent() {
			this.$emit("eventSaved", this.eventData);
		},
		addEventLink() {
			if (!this.eventData.eventLinks) this.eventData.eventLinks = [];

			const newLink: IEventLink = {
				title: null,
				event: [JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE))],
			};
			this.eventData.eventLinks.push(newLink);
		},
		removeEventLink(eventLink: IEventLink) {
			this.eventData.eventLinks = this.eventData.eventLinks.filter((e) => e != eventLink);
			if (this.eventData.eventLinks.length === 0) delete this.eventData.eventLinks;
		},
		addResult() {
			if (!this.eventData.results) this.eventData.results = { pickRandom: false, changes: [] };

			const newResult: IEventResult = {
				modifier: "add",
				type: "item",
				key: null,
				value: null,
			};

			this.eventData.results.changes.push(newResult);
		},
		removeResult(result: IEventResult) {
			this.eventData.results.changes = this.eventData.results.changes.filter((e) => e != result);
			if (this.eventData.results.changes.length == 0) delete this.eventData.results;
		},
		addCondition() {
			if (!this.eventData.requirements) {
				this.eventData.requirements = {
					match: "All of",
					conditions: [],
					failEvent: JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE)),
				};
			}

			const newCondition: IEventCondition = {
				match: "All of",
				type: null,
				values: null,
			};

			this.eventData.requirements.conditions.push(newCondition);
		},
		removeCondition(condition: IEventCondition) {
			this.eventData.requirements.conditions = this.eventData.requirements.conditions.filter((e) => e != condition);
			if (this.eventData.requirements.conditions.length == 0) delete this.eventData.requirements;
			//If requirement object contains no definitions, delete it from thing
			//if (this.eventData.requirements.changes.length == 0) delete this.eventData.results;
		},
	},
});
</script>
