<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200">
			<v-card width="1200px" :title="eventData.embedOptions.title">
				<v-card-text style="max-height: 80vh" class="mx-3 overflow-y-auto">
					<v-expansion-panels variant="accordion" multiple>
						<v-expansion-panel title="Embed Options" color="red-darken-3">
							<v-expansion-panel-text>
								<v-row no-gutters>
									<v-col cols="12">
										<v-text-field label="Embed Title" :readonly="!allowEdit" v-model="eventData.embedOptions.title" density="compact" required></v-text-field>
										<v-textarea v-model="eventData.embedOptions.description" :readonly="!allowEdit" label="Description" required rows="2"></v-textarea>
										<v-text-field label="Thumbnail" :readonly="!allowEdit" v-model="eventData.embedOptions.thumbnail" density="compact"></v-text-field>
										<v-text-field label="Image" :readonly="!allowEdit" v-model="eventData.embedOptions.image" density="compact"></v-text-field>
										<v-color-picker
											v-model="eventData.embedOptions.color"
											show-swatches
											hide-canvas
											hide-inputs
											hide-sliders
											:swatches="swatches"
										></v-color-picker>
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
					</v-expansion-panels>
				</v-card-text>
				<v-card-actions>
					<small style="opacity: 0.2">Event ID: {{ eventData.id }}</small>

					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
					<v-btn v-if="allowEdit" color="green darken-1" :disabled="!eventData.embedOptions.title" text @click="saveEvent()"> Save </v-btn>
					<!-- <v-btn v-if="allowEdit" color="green darken-1" :disabled="!item.name || !item.category || !item.encumbrance" text @click="saveNewItem()"> Save </v-btn> -->
					<!-- <v-btn color="blue darken-1" text @click="show = false">
						Save
					</v-btn> -->
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

<script lang="ts">
import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
import DrpgSwatches from "@/types/DrpgColors";
import type { IEventBase } from "@/types/SwrpgTypes/IEventBase";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "EventFullView",
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
	},
});
</script>
