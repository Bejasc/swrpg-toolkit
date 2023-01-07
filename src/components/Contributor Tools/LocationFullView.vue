<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200px">
			<v-card class="pa-4" :title="locData.location.name">
				<v-card-text style="max-height: 80vh" class="mx-3 overflow-y-auto">
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

						<v-row no-gutters>
							<v-text-field
								label="Aliases"
								placeholder="Other names, separated by comma"
								:readonly="!allowEdit"
								v-model="helpers.aliasString"
								density="compact"
							></v-text-field>
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
									v-model="locData.location.coordinates.sector"
									v-bind:readonly="!allowEdit"
									label="Sector"
									density="compact"
								></v-text-field>
							</v-col>
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
									label="Hyperlane Proximity"
									type="number"
									density="compact"
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<small style="opacity: 0.2">Location ID: {{ locData.location._id }}</small>

					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
					<v-btn v-if="allowEdit" color="green darken-1" :disabled="!locData.location.name" text @click="saveLocation()"> Save </v-btn>
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

<script setup lang="ts">
import { ISwrpgLocationData } from "@/types/SwrpgTypes";
import { computed, reactive, watch } from "vue";

const props = defineProps<{
	show: boolean;
	allowEdit: boolean;
	locData: ISwrpgLocationData;
}>();

const emit = defineEmits(["locationSaved"]);

function saveLocation() {
	const a = helpers.aliasString.replace(" ", "").split(",");
	props.locData.location.aliases = a;
	emit("locationSaved", props.locData);
}

function changePlanetImage() {
	if (!props.allowEdit) return;
	const imageUrl = prompt("Enter the URL for the new image", props.locData.location.planetImage);
	if (imageUrl != null) props.locData.location.planetImage = imageUrl;
}
function changeEnvironmentImage() {
	if (!props.allowEdit) return;
	const imageUrl = prompt("Enter the URL for the new image", props.locData.location.image);
	if (imageUrl != null) props.locData.location.image = imageUrl;
}

interface IHelpers {
	aliasString: string;
}

const initialState: IHelpers = {
	aliasString: "",
};

const helpers = reactive({ ...initialState });

function setHelper() {
	const newState: IHelpers = initialState;
	newState.aliasString = props.locData.location.aliases?.join(", ") ?? "";

	Object.assign(helpers, JSON.parse(JSON.stringify(newState)));
}

watch(
	() => props.locData?.location?._id,
	(newVal, oldVal) => {
		setHelper();
	},
);
</script>
