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
		<!-- <v-expansion-panel title="Conditions"> </v-expansion-panel> -->
		<v-expansion-panel title="Results">
			<v-expansion-panel-text>
				<div align="left" class="text-caption font-italic text-medium-emphasis ma-4" v-if="isTopLevel">
					Results are the affects that are applied to the player when this node of the Event is hit. <br />
					They could be awarded or penalized Credits, Skill Points or Items, or something else.
					<span v-if="eventData.results.changes.some((e) => e.type === 'item')"
						><br />
						<br />Not seeing an Item you want? Head to the Item Creator to create the item and have it added!</span
					>
				</div>
				<EventResult
					:allow-edit="allowEdit"
					v-for="result in eventData.results.changes"
					:event-result="result"
					:remove-result="removeResult"
					:all-items="allItems"
				></EventResult>
				<v-row>
					<v-col cols="1" class="ma-3">
						<v-btn color="green" variant="text" @click="addResult()">Add Result</v-btn>
					</v-col>
					<v-col cols="4">
						<v-checkbox v-if="eventData.results.changes.length > 1" v-model="eventData.results.pickRandom" label="Pick one at random"></v-checkbox>
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
				<EventLinkComponent
					:allow-edit="allowEdit"
					:event-link="eventLink"
					v-for="(eventLink, index) in eventData.eventLinks"
					:key="index"
					:remove-event-link="removeEventLink"
					:all-items="allItems"
				></EventLinkComponent>

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
import type { IEventBase, IEventLink, IEventResult } from "@/types/SwrpgTypes/IEventBase";
import type IItem from "@/types/SwrpgTypes/IItem";
import mongoose from "mongoose";
import { defineComponent, type PropType } from "vue";
import EventResult from "./EventResult.vue";
export default defineComponent({
	name: "EventEditor",
	components: { DiscordEmbed, EventResult },
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
		};
	},
	methods: {
		async saveEvent() {
			(this.$parent as any).showLoader = true;

			this.$emit("eventSaved", this.eventData);
			(this.$parent as any).showLoader = false;
		},
		addEventLink() {
			const newLink: IEventLink = {
				title: null,
				eventId: [
					{
						id: new mongoose.Types.ObjectId().toString(),
						embedOptions: {
							color: "#E6A00E",
						},
						eventLinks: [],
						results: {
							pickRandom: false,
							changes: [],
						},
					},
				],
			};
			this.eventData.eventLinks.push(newLink);
		},
		removeEventLink(eventLink: IEventLink) {
			this.eventData.eventLinks = this.eventData.eventLinks.filter((e) => e != eventLink);
		},
		addResult() {
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
		},
	},
});
</script>
