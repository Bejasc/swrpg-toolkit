<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent max-height="1000px">
			<div style="width: 700px">
				<v-card class="pa-4" :title="locData.location.name">
					<v-card-text>
						<v-container>
							<v-row class="mb-10">
								<div align="left" class="text-caption font-italic">
									Use <a href="http://www.swgalaxymap.com/" target="_blank">SWGalaxyMap</a> to help with this information. Note - Curently has issues with search
									<br />
									For Planet Images - the best source is <a href="https://www.swcombine.com/rules/?Search" target="_blank">SWCombine</a> - for
									<span style="font-weight: bold">images only</span>. Please upload image to Discord first.
								</div>
								<v-divider class="ma-2" />
							</v-row>

							<v-row no-gutters>
								<v-col cols="7">
									<v-text-field label="Location Name*" :readonly="!allowEdit" v-model="locData.location.name" density="compact" required></v-text-field>
									<v-textarea v-model="locData.location.description" :readonly="!allowEdit" label="Description" required rows="2"></v-textarea>
								</v-col>
								<v-spacer />
								<v-col cols="4" style="margin-top: -30px">
									<v-img :src="locData.location.planetImage" :disabled="!allowEdit" class="itemThumbnail" @click="changePlanetImage()" />
									<div v-if="allowEdit" align="center" class="text-caption font-italic">Click image to change</div>
								</v-col>
							</v-row>

							<v-divider class="mb-7" />

							<v-row>
								<v-col cols="6">
									<v-text-field
										class="pa-1"
										v-model="locData.location.landingSite"
										v-bind:readonly="!allowEdit"
										label="Landing Site Name"
										density="compact"
									></v-text-field>
									<v-checkbox v-if="allowEdit" v-model="hasMarket" :label="`Has Market: ${hasMarket ? 'Yes' : 'No'}`"></v-checkbox>
								</v-col>
								<v-col cols="6">
									<v-img :src="locData.location.image" :disabled="!allowEdit" class="itemThumbnail" @click="changeEnvironmentImage()" />
									<div v-if="allowEdit" align="center" class="text-caption font-italic">Click image to change</div>
								</v-col>
							</v-row>

							<v-divider class="ma-4" />

							<v-row no-gutters>
								<v-col cols="6">
									<v-text-field
										class="pa-1"
										v-model="locData.location.coordinates.region"
										v-bind:readonly="!allowEdit"
										label="Region"
										density="compact"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										class="pa-1"
										v-model="locData.location.coordinates.sector"
										v-bind:readonly="!allowEdit"
										label="Sector"
										density="compact"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-row no-gutters>
										<v-col cols="6" class="pa-1">
											<v-text-field
												v-model="locData.location.coordinates.x"
												v-bind:readonly="!allowEdit"
												type="number"
												label="X"
												density="compact"
											></v-text-field>
										</v-col>
										<v-col cols="6" class="pa-1">
											<v-text-field
												v-model="locData.location.coordinates.y"
												v-bind:readonly="!allowEdit"
												type="number"
												label="Y"
												density="compact"
											></v-text-field>
										</v-col>
									</v-row>
								</v-col>
								<v-col cols="6">
									<v-text-field
										class="pa-1"
										v-model="locData.location.coordinates.hyperlaneProximity"
										v-bind:readonly="!allowEdit"
										label="Hyperlane Proximity (TODO)"
										type="number"
										density="compact"
										disabled
									></v-text-field>
								</v-col>
							</v-row>

							<div v-if="hasMarket" id="marketProperties">
								<v-divider class="ma-4" />

								<div align="left" class="text-caption font-italic">
									Market definition is coming soon = including the ability to whitelist/blacklist items and set 'activity level'
								</div>
							</div>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<small style="opacity: 0.2">Location ID: {{ locData.location._id }}</small>

						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
						<v-btn v-if="allowEdit" color="green darken-1" :disabled="!locData.location.name" text @click="saveNewLocation()"> Save </v-btn>
						<!-- <v-btn v-if="allowEdit" color="green darken-1" :disabled="!item.name || !item.category || !item.encumbrance" text @click="saveNewItem()"> Save </v-btn> -->
						<!-- <v-btn color="blue darken-1" text @click="show = false">
						Save
					</v-btn> -->
					</v-card-actions>
				</v-card>
			</div>
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
import type { ILocationData } from "@/types/SwrpgTypes/ILocation";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "LocationFullView",
	props: {
		show: Boolean,
		locData: {
			type: Object as PropType<ILocationData>,
			required: true,
		},
		allowEdit: Boolean,
	},
	data: () => {
		return {
			aliasString: "",
			hasMarket: false,
		};
	},
	methods: {
		getAliases(): string {
			return this.locData.location.aliases?.join(", ") ?? "";
		},
		async saveNewLocation() {
			(this.$parent as any).showLoader = true;
			const a = this.aliasString.replace(" ", "").split(",");

			this.locData.location.aliases = a;

			this.$emit("locationAdded", this.locData);
			(this.$parent as any).showLoader = false;
		},
		changePlanetImage() {
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.locData.location.planetImage);
			if (imageUrl != null) this.locData.location.planetImage = imageUrl;
		},
		changeEnvironmentImage() {
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.locData.location.image);
			if (imageUrl != null) this.locData.location.image = imageUrl;
		},
	},
});
</script>
