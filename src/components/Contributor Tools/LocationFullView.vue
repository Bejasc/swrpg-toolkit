<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200px">
			<v-card class="pa-4" :title="location.name">
				<v-card-text>
					<v-container>
						<v-row no-gutters>
							<v-col cols="8">
								<v-text-field label="Location Name*" :readonly="!allowEdit" v-model="location.name" density="compact" required></v-text-field>
							</v-col>
							<v-col cols="4" style="margin-top: -30px">
								<v-img :src="location.planetImage" :disabled="!allowEdit" class="itemThumbnail" width="140px" @click="changePlanetImage()" />
								<div v-if="allowEdit" align="center" class="text-caption font-italic">Click image to change</div>
							</v-col>
							<v-col cols="12" class="pt-6">
								<v-textarea v-model="location.description" :readonly="!allowEdit" label="Description" required rows="2"></v-textarea>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<small style="opacity: 0.2">Location ID: {{ location._id }}</small>

					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
					<v-btn v-if="allowEdit" color="green darken-1" :disabled="!location.name" text @click="saveNewLocation()"> Save </v-btn>
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
</style>

<script lang="ts">
import type { ILocation } from "@/types/SwrpgTypes/ILocation";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "LocationFullView",
	props: {
		show: Boolean,
		location: {
			type: Object as PropType<ILocation>,
			required: true,
		},
		allowEdit: Boolean,
	},
	data: () => {
		return {
			aliasString: "",
		};
	},
	methods: {
		getAliases(): string {
			return this.location.aliases?.join(", ") ?? "";
		},
		async saveNewLocation() {
			(this.$parent as any).showLoader = true;
			const a = this.aliasString.replace(" ", "").split(",");

			this.location.aliases = a;

			this.$emit("locationAdded", this.location);
			(this.$parent as any).showLoader = false;
		},
		changePlanetImage() {
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.location.planetImage);
			if (imageUrl != null) this.location.planetImage = imageUrl;
		},
		changeEnvironmentImage() {
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.location.image);
			if (imageUrl != null) this.location.image = imageUrl;
		},
	},
});
</script>
