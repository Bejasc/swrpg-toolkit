<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel :id="eventData.id">
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					<v-row no-gutters>
						<v-col cols="4" class="d-flex justify-start"> Embed Options </v-col>
						<v-col cols="8" class="text-grey">
							<v-fade-transition leave-absolute>
								<span v-if="expanded" key="0"> How the event will be displayed </span>
							</v-fade-transition>
						</v-col>
					</v-row>
				</template>
			</v-expansion-panel-title>
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
		<!-- <v-expansion-panel title="Results"> </v-expansion-panel> -->
		<v-expansion-panel>
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					<v-row no-gutters>
						<v-col cols="4" class="d-flex justify-start"> Event Links </v-col>
					</v-row>
				</template>
			</v-expansion-panel-title>
			<v-expansion-panel-text>
				<div align="left" class="text-caption font-italic text-medium-emphasis">
					For each entry, a Button will be shown for that entry as an available choice. For each choice, multiple events can be provided - one will be picked at random.
					<br />
					If no link is provided - this event ({{ eventData.embedOptions.title }}) will be considered as the conclusion.
				</div>
				<v-expansion-panels variant="accordion">
					<v-expansion-panel v-for="(eventLink, index) in eventData.eventLinks" :key="index" :title="eventLink.title ?? 'Unnamed Option'">
						<v-expansion-panel-text>
							<v-row no-gutters>
								<v-col cols="4">
									<v-text-field
										label="Button Label"
										:readonly="!allowEdit"
										v-model="eventLink.title"
										density="compact"
										placeholder="Pickup"
										required
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										label="Short Description"
										:readonly="!allowEdit"
										v-model="eventLink.description"
										density="compact"
										placeholder="Pickup the credits"
										required
									></v-text-field>
								</v-col>
							</v-row>

							<EventEditor :allow-edit="allowEdit" :event-data="eventLink.eventId"></EventEditor>

							<v-btn variant="outlined" color="red" outline>
								<v-icon icon="mdi-delete-outline" /> Remove {{ eventLink.title }} Option

								<v-dialog class="myDialog" v-model="dialogConfirmDeleteLink" activator="parent" transition="fade-transition" persistent>
									<v-card>
										<v-card-text> Are you sure you want to remove this event link? <br />This cannot be undone </v-card-text>
										<v-card-actions>
											<v-spacer />
											<v-btn color="blue" @click="dialogConfirmDeleteLink = false">Cancel</v-btn>
											<v-btn color="red" @click="removeEventLink(index)">Remove</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
							</v-btn>
						</v-expansion-panel-text>
					</v-expansion-panel>
					<v-btn color="success" variant="text" @click="addEventLink()">Add New Option</v-btn>
				</v-expansion-panels>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<style scoped>
.myDialog {
	position: absolute;
	margin: 0 auto !important;
	width: 400px;
}
</style>

<script lang="ts">
import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
import DrpgSwatches from "@/types/DrpgColors";
import type { IEventBase } from "@/types/SwrpgTypes/IEventBase";
import mongoose from "mongoose";
import { defineComponent, type PropType } from "vue";
export default defineComponent({
	name: "EventEditor",
	components: { DiscordEmbed },
	props: {
		show: Boolean,
		eventData: {
			type: Object as PropType<IEventBase>,
			required: true,
		},
		allowEdit: Boolean,
	},
	data: () => {
		return {
			previewEmbed: false,
			swatches: DrpgSwatches,
			dialogConfirmDeleteLink: false,
			nestedEventShow: false,
		};
	},
	methods: {
		updateColor(value: string) {
			alert(value);
		},
		async saveEvent() {
			(this.$parent as any).showLoader = true;

			this.$emit("eventSaved", this.eventData);
			(this.$parent as any).showLoader = false;
		},
		changeEmbedImage() {
			if (!this.allowEdit) return;
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.eventData.embedOptions.image);
			if (imageUrl != null) this.eventData.embedOptions.image = imageUrl;
		},
		changeThumbnailImage() {
			if (!this.allowEdit) return;

			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.eventData.embedOptions.thumbnail);
			if (imageUrl != null) this.eventData.embedOptions.thumbnail = imageUrl;
		},
		addEventLink() {
			this.eventData.eventLinks.push({
				title: null,
				eventId: [
					{
						id: new mongoose.Types.ObjectId().toString(),
						embedOptions: {
							color: "#E6A00E",
						},
						eventLinks: [],
					},
				],
			});
		},
		removeEventLink(index: number) {
			this.eventData.eventLinks.splice(index, 1);
			this.dialogConfirmDeleteLink = false;
		},
	},
});
</script>
