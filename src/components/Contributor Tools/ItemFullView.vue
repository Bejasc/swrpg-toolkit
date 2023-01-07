<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200px">
			<v-card class="pa-4" :title="item.name">
				<v-card-text>
					<v-container>
						<v-expansion-panels accordion>
							<v-expansion-panel title="General Properties">
								<v-expansion-panel-text>
									<v-row no-gutters>
										<v-col cols="7">
											<v-text-field label="Item Name*" :readonly="!allowEdit" v-model="item.name" density="compact" required></v-text-field>
											<v-text-field
												label="Aliases"
												placeholder="Other names, separated by comma"
												:readonly="!allowEdit"
												v-model="helpers.aliasString"
												density="compact"
											></v-text-field>
										</v-col>
										<v-spacer />
										<v-col cols="4">
											<v-img :src="item.image" :disabled="!allowEdit" class="itemThumbnail" height="100px" @click="changeItemImage()" />
											<div v-if="allowEdit" align="center" class="text-caption font-italic">Click image to change</div>
										</v-col>
									</v-row>

									<v-row no-gutters>
										<v-row>
											<v-col cols="6">
												<v-autocomplete
													v-model="item.category"
													:readonly="!allowEdit"
													:items="itemCategories"
													label="Category"
													density="compact"
												></v-autocomplete>
											</v-col>
											<v-col cols="6">
												<v-text-field
													v-model="item.encumbrance"
													v-bind:readonly="!allowEdit"
													prepend-inner-icon="mdi-weight"
													type="number"
													label="Encumbrance"
													density="compact"
												></v-text-field>
											</v-col>
										</v-row>
										<v-col cols="12">
											<v-textarea v-model="item.description" :readonly="!allowEdit" label="Description" required rows="2"></v-textarea>
										</v-col>
										<v-col cols="4">
											<v-checkbox v-if="allowEdit" v-model="item.tradeProperties.isTradeable" :label="`Is Tradeable`"></v-checkbox>
										</v-col>
									</v-row>
								</v-expansion-panel-text>
							</v-expansion-panel>
							<v-expansion-panel title="Trade Properties" v-if="item.tradeProperties.isTradeable">
								<v-expansion-panel-text>
									<v-row>
										<v-col cols="5">
											<v-select :items="itemRarities" v-model="item.tradeProperties.itemRarity" label="Rarity" density="compact"></v-select>
										</v-col>
										<v-col cols="7">
											<v-text-field
												v-model="item.tradeProperties.baseValue"
												prepend-inner-icon="mdi-cash"
												type="number"
												label="Base Value"
												density="compact"
											></v-text-field>
										</v-col>
									</v-row>
									<v-row>
										<v-checkbox
											v-model="helpers.tradeAvailableEverywhere"
											:label="`Is Available Everywhere: ${helpers.tradeAvailableEverywhere ? 'Yes' : 'No'}`"
											:readonly="!allowEdit"
											v-if="allowEdit == true"
										></v-checkbox>
										<!-- <v-switch v-model="marketHelper.isWhitelist" :label="`Treat list as ${marketHelper.isWhitelist ? 'Whitelist' : 'Blacklist'}`"> </v-switch> -->
										<v-radio-group
											inline
											v-if="!helpers.tradeAvailableEverywhere && allowEdit == true"
											v-model="helpers.tradeMode"
											@update:model-value="whitelistModeChanged"
											:readonly="!allowEdit"
										>
											<v-radio label="Whitelist" value="whitelist"></v-radio>
											<v-radio label="Blacklist" value="blacklist"></v-radio>
										</v-radio-group>
									</v-row>
									<p class="text-caption" v-if="allowEdit">{{ marketHelperText }}</p>
									<v-alert density="compact" type="info" variant="outlined" v-else>
										{{ marketHelperText }}
									</v-alert>
									<v-col cols="12" v-if="!helpers.tradeAvailableEverywhere && allowEdit == true">
										<LocationPicker :selected-values="helpers.tradeLocationIds" @selection-changed="selectedLocationsChanged"></LocationPicker>
									</v-col>
									<!-- <v-row>
								<v-expansion-panels>
									<v-expansion-panel title="Market Overrides" color="blue">
										<v-expansion-panel-text> </v-expansion-panel-text>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-row> -->
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<small style="opacity: 0.2">Item ID: {{ item._id }}</small>

					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
					<v-btn v-if="allowEdit" color="green darken-1" :disabled="!item.name || !item.category" text @click="saveNewItem()"> Save </v-btn>
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

<script setup lang="ts">
import LocationPicker from "@/components/LocationSelector.vue";
import { IItem, ILocation } from "@/types/SwrpgTypes";
import { computed, reactive, ref, Ref, watch } from "vue";

const props = defineProps<{
	show: boolean;
	allowEdit: boolean;
	item: IItem;
	locations: ILocation[];
}>();

const emit = defineEmits(["saveItem"]);

function saveNewItem() {
	const a = helpers.aliasString.replace(" ", "").split(",");
	props.item.aliases = a;
	emit("saveItem", props.item);
}

function changeItemImage() {
	if (!this.allowEdit) return;
	const imageUrl = prompt("Enter the URL for the new image", props.item.image);
	if (imageUrl != null) props.item.image = imageUrl;
}

function whitelistModeChanged(val) {
	if (val === "whitelist") {
		props.item.tradeProperties.locationWhitelist = props.item.tradeProperties.locationBlacklist;
		props.item.tradeProperties.locationBlacklist = undefined;
	} else {
		props.item.tradeProperties.locationBlacklist = props.item.tradeProperties.locationWhitelist;
		props.item.tradeProperties.locationWhitelist = undefined;
	}
}

function selectedLocationsChanged(newValue?: string[]) {
	helpers.tradeLocationIds = newValue;
	if (helpers.tradeMode === "whitelist") {
		props.item.tradeProperties.locationWhitelist = newValue;
	} else {
		props.item.tradeProperties.locationBlacklist = newValue;
	}
}

const itemCategories = computed(() => {
	return ["Unknown", "Food", "Armour", "Weapons", "Medical", "Tools", "Clothing", "Resources", "Minerals", "Luxuries", "Waste", "Technology", "Salvage", "Chemicals"];
});

const itemRarities = computed(() => {
	return ["Abundant", "Common", "Uncommon", "Rare", "Legendary", "Unique"];
});

const marketHelperText = computed(() => {
	const matchingLocations = props.locations.filter((e) => helpers.tradeLocationIds.includes(e._id));
	const matchingLocationNames = matchingLocations.map((e) => e.name).join(", "); //TODO joinstr
	if (helpers.tradeAvailableEverywhere) {
		return `${props.item.name} can be bought and sold everywhere.`;
	} else {
		if (helpers.tradeMode === "whitelist") {
			return `${props.item.name} can *ONLY* be bought and sold on ${matchingLocationNames}.`;
		} else {
			return `${props.item.name} can be bought and sold everywhere *EXCEPT* on ${matchingLocationNames}`;
		}
	}
});

//-------------

interface IHelpers {
	aliasString: string;
	tradeAvailableEverywhere: boolean;
	tradeMode: "blacklist" | "whitelist";
	tradeLocationIds: string[];
}

const initialState: IHelpers = {
	aliasString: "",
	tradeAvailableEverywhere: true,
	tradeMode: "whitelist",
	tradeLocationIds: [],
};

const helpers = reactive({ ...initialState });

function setHelper() {
	const newState: IHelpers = initialState;
	newState.aliasString = props.item.aliases?.join(", ") ?? "";

	if (props.item.tradeProperties) {
		if (props.item.tradeProperties.locationBlacklist?.length > 0 || props.item.tradeProperties.locationWhitelist?.length > 0) {
			newState.tradeAvailableEverywhere = false;

			if (props.item.tradeProperties.locationWhitelist?.length > 0) {
				newState.tradeMode = "whitelist";
				newState.tradeLocationIds = props.item.tradeProperties.locationWhitelist;
			} else {
				newState.tradeMode = "blacklist";
				newState.tradeLocationIds = props.item.tradeProperties.locationBlacklist;
			}
		} else {
			newState.tradeAvailableEverywhere = true;
		}
	}

	Object.assign(helpers, JSON.parse(JSON.stringify(newState)));
}

watch(
	() => props.item._id,
	(newVal, oldVal) => {
		setHelper();
	},
);
</script>
