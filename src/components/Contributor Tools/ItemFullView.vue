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
													@update:model-value="(event) => categoryChanged(event)"
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
							<v-expansion-panel title="Weapon Properties" v-if="item.category === 'Weapon'">
								<v-expansion-panel-text>
									<v-row>
										<v-col cols="6">
											<v-select :items="weaponTypes" v-model="item.weaponProperties.weaponType" label="Weapon Type" :readonly="!allowEdit"></v-select>
										</v-col>
										<v-col cols="3">
											<v-select
												:items="weaponHandling"
												item-title="title"
												item-value="value"
												v-model="item.weaponProperties.handling"
												label="Handling"
												:readonly="!allowEdit"
											></v-select>
										</v-col>
										<v-col cols="3">
											<v-checkbox
												v-model="helpers.hasRequirement"
												:label="`Ability Requirement: ${helpers.hasRequirement ? 'Yes' : 'No'}`"
												:readonly="!allowEdit"
												v-if="allowEdit == true"
											></v-checkbox>
										</v-col>
									</v-row>
									<v-row>
										<!-- <v-col cols="7">
											<v-range-slider
												style="margin-top: 10px"
												:min="1"
												:max="20"
												:step="1"
												hide-details
												thumb-label
												show-ticks="always"
												label="Damage Range"

											/>
										</v-col> -->
										<v-col cols="6">
											<v-select :items="damageTypes" v-model="item.weaponProperties.damageType" label="Damage Type" :readonly="!allowEdit"></v-select>
										</v-col>
										<v-col cols="3">
											<v-text-field
												v-model="item.weaponProperties.minDamage"
												type="number"
												label="Min Damage"
												:rules="minDamageRules"
												:readonly="!allowEdit"
											></v-text-field>
										</v-col>
										<v-col cols="3">
											<v-text-field
												v-model="item.weaponProperties.maxDamage"
												type="number"
												label="Max Damage"
												:rules="maxDamageRules"
												:readonly="!allowEdit"
											></v-text-field>
										</v-col>
									</v-row>
									<template v-if="helpers.hasRequirement">
										<p class="h1">Attribute Requirements</p>
										<v-container>
											<template v-for="req in props.item.weaponProperties.attributeRequirement">
												<v-row no-gutters>
													<v-col cols="4">
														<v-autocomplete
															label="Item"
															:items="supportedAttributes"
															v-model="req.attribute"
															item-title="title"
															item-value="value"
															variant="solo"
															v-bind:readonly="!allowEdit"
														></v-autocomplete>
													</v-col>

													<v-col cols="2">
														<v-text-field v-model="req.level" v-bind:readonly="!allowEdit" type="number" label="Level" variant="solo"></v-text-field>
													</v-col>
													<v-btn
														style="margin-bottom: 10px"
														color="red"
														variant="plain"
														icon="mdi-delete-outline"
														size="small"
														@click.stop="removeRequirement(req)"
													>
													</v-btn>
												</v-row>
											</template>
										</v-container>

										<v-row>
											<v-col cols="1">
												<v-btn style="margin-left: 40px" color="green" variant="text" @click="addRequirement()">Add Requirement</v-btn>
											</v-col>
										</v-row>
									</template>
								</v-expansion-panel-text>
							</v-expansion-panel>
							<v-expansion-panel title="Equipment Properties" v-if="item.category === 'Clothing' || item.category === 'Armour'"> </v-expansion-panel>
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
import { joinString } from "@/plugins/Utils";
import { DamageTypes, getMatchingLocation, IItem, ILocation, WeaponTypes, EquipmentSlots, DEFAULT_WEAPON, DEFUALT_EQUIPMENT, WeaponHandling } from "@/types/SwrpgTypes";
import { supportedAttributes } from "@/types/SwrpgTypes/FixedData";
import { computed, reactive, ref, Ref, watch } from "vue";
const props = defineProps<{
	show: boolean;
	allowEdit: boolean;
	item: IItem;
	locations: ILocation[];
}>();

const emit = defineEmits(["saveItem"]);

function categoryChanged(value: string) {
	if (value === "Weapon") {
		if (!props.item.weaponProperties) {
			props.item.weaponProperties = DEFAULT_WEAPON();
		}
	} else if (["Armour", "Clothing"].includes(props.item.category)) {
		if (!props.item.equipmentProperties) {
			props.item.equipmentProperties = DEFUALT_EQUIPMENT();
		}
	}
}

function saveNewItem() {
	const a = helpers.aliasString.replace(" ", "").split(",");
	props.item.aliases = a;
	emit("saveItem", props.item);

	if (props.item.category !== "Weapon") {
		props.item.weaponProperties = undefined;
	}
	if (!["Armour", "Clothing"].includes(props.item.category)) {
		props.item.equipmentProperties = undefined;
	}
}

function changeItemImage() {
	if (!props.allowEdit) return;
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
	return ["Unknown", "Food", "Armour", "Weapon", "Medical", "Tools", "Clothing", "Resources", "Minerals", "Luxuries", "Waste", "Technology", "Salvage", "Chemicals"];
});

const itemRarities = computed(() => {
	return ["Abundant", "Common", "Uncommon", "Rare", "Legendary", "Unique"];
});

const damageTypes = computed(() => {
	return Object.values(DamageTypes).filter((e) => ["Fire", "Blast"].includes(e) == false);
});

const weaponTypes = computed(() => {
	return Object.values(WeaponTypes).filter((e) => ["Lightsaber", "Unarmed", "Thrown", "Slugthrower"].includes(e) == false);
});

const weaponHandling = [
	{ title: "Terrible", value: 0.5 },
	{ title: "Poor", value: 0.75 },
	{ title: "Average", value: 1 },
	{ title: "Good", value: 1.25 },
	{ title: "Great", value: 1.5 },
];

const equipmentSlots = computed(() => {
	return Object.values(EquipmentSlots);
});

const minDamageRules = computed(() => {
	return [(v) => (v && v >= 1) || "Minimum damage must be at least 1", (v) => (v && v <= props.item.weaponProperties.maxDamage) || "Min Damage cannot be higer than Max Damage"];
});

const maxDamageRules = computed(() => {
	return [
		(v) => (v && v <= 25) || "Max damage must not be higher thant 25",
		(v) => (v && v >= props.item.weaponProperties.minDamage) || "Max Damage cannot be lower than Min Damage",
	];
});

function addRequirement() {
	if (!props.item.weaponProperties.attributeRequirement) props.item.weaponProperties.attributeRequirement = [];

	const newRequirement = {
		attribute: "Strength",
		level: 1,
	};

	props.item.weaponProperties.attributeRequirement.push(newRequirement);
}

function removeRequirement(requirement: { attribute: string; level: number }) {
	props.item.weaponProperties.attributeRequirement = props.item.weaponProperties.attributeRequirement.filter((e) => e != requirement);
	if (props.item.weaponProperties.attributeRequirement.length == 0) delete props.item.weaponProperties.attributeRequirement;
}

const marketHelperText = computed(() => {
	const matchingLocations = props.locations.filter((e) => helpers.tradeLocationIds.includes(e._id));
	const matchingLocationNames = joinString(matchingLocations.map((e) => e.name));
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
	hasRequirement: boolean;
}

const initialState: IHelpers = {
	aliasString: "",
	tradeAvailableEverywhere: true,
	hasRequirement: false,
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

			newState.tradeLocationIds = newState.tradeLocationIds.map((e) => {
				const location = getMatchingLocation(e, props.locations);
				if (e != location._id) console.log(`${props.item.name} provided ${e} as a trade location. Overriding to ID based value instead. ${location._id}`);
				return location._id;
			});
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
