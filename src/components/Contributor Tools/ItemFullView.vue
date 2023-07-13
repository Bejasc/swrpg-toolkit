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
									<p class="text-caption" v-if="allowEdit">
										Looking to create a <strong>Weapon</strong> or <strong>Armour/Clothing</strong> Item?<br />Select the appropriate category and provide their
										relevant stats below.
									</p>
								</v-expansion-panel-text>
							</v-expansion-panel>
							<v-expansion-panel title="Trade Properties" v-if="item.tradeProperties.isTradeable">
								<v-expansion-panel-text>
									<v-row v-if="allowEdit">
										<v-col cols="12">
											<v-alert class="text-caption" title="Trading Notes" type="info" variant="outlined" density="compact" closable>
												<strong>Price and Rarity Relationship</strong> <br />
												Items that are less rare will generally appear in markets in higher quantities, and be slightly more stable in their price. <br />
												Rarer (or higher priced) items will generally fluctuate in price more than less rare (or lower priced items).
												<br /><br />
												<strong>Overrides</strong><br />
												It is possible for the Rarity or a price modifier to be overrideen on a per-location basis. <br />
												This can be controlled either via the Location, or the Item itself.
											</v-alert>
										</v-col>
									</v-row>

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
									<v-row v-if="allowEdit">
										<v-col cols="12">
											<v-alert class="text-caption" title="Weapon Notes" type="info" variant="outlined" density="compact" closable>
												<strong>Handling</strong> <br />
												Based on the Weapon Type, Characters will be able to add their <strong>Strength/Hand to Hand</strong> stat, or their
												<strong>Dexterity/Marksman</strong> stat to boost their original roll, and their chances to hit. Equipped gear may also provide
												bonuses or penalties to this value. <br />The handling will affect how much of this total they can use, anywhere from 50% (Terrible)
												to 150% (Great).
												<br />
												<br />
												<strong>Damage Output</strong><br />
												The amount of damage dealt by this weapon on hit, will be a random number chosen between the min and max value. <br />
												Note that certain armours may be more resistant or susceptible to certain damage types, which will reduce or add to the damage they
												receive.
												<br />
												No other skill or effect impacts this.
											</v-alert>
										</v-col>
									</v-row>

									<v-row>
										<v-col cols="6">
											<v-select :items="weaponTypes" v-model="item.weaponProperties.weaponType" label="Weapon Type" :readonly="!allowEdit"></v-select>
										</v-col>
										<v-col cols="3">
											<!-- <v-select
												:items="weaponHandling"
												item-title="title"
												item-value="value"
												v-model="item.weaponProperties.handling"
												label="Handling"
												:readonly="!allowEdit"
											></v-select> -->
											<v-text-field
												v-model="item.weaponProperties.handling"
												type="number"
												:label="getWeaponHandlingPower()"
												density="compact"
												step="0.1"
												:min="0.5"
												:max="2"
												:readonly="!allowEdit"
											></v-text-field>
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
							<v-expansion-panel title="Equipment Properties" v-if="item.category === 'Clothing' || item.category === 'Armour'">
								<v-expansion-panel-text>
									<v-row v-if="allowEdit">
										<v-col cols="12">
											<v-alert class="text-caption" title="Equipment Notes" type="info" variant="outlined" density="compact" closable>
												<strong>Armour Bonus</strong> <br />
												As players can wear multiple pieces of Armour, consider that the Armour Bonus is added as a
												<strong>boost to the wearers Armor Class</strong>. Multiple pieces of Armour that provide a boost may quickly become OP. A higher
												Armour Bonus in effect means the wearer is less likely to be hit.<br />
												For this reason, it's suggested that the Armour Bonus is kept to none or low unless it is a higher tier item. <br />
												<br />
												<strong>Damage Resistance and Susceptability</strong><br />
												This is the amount of damage that will be ignored (or added), if the wearer is hit by a weapon of that type.<br />
												For example, if the item has a -3 Susceptability to Ion, if the wearer is hit by a weapon dealing 4 Ion damage, the wearer will
												suffer 7 Ion damage.
											</v-alert>
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="6">
											<v-select
												item-title="title"
												item-value="value"
												:items="equipmentSlots"
												v-model="item.equipmentProperties.slot"
												label="Equipment Slot"
												multiple
												:readonly="!allowEdit"
											></v-select>
										</v-col>
										<v-col cols="3">
											<v-text-field
												v-model="item.equipmentProperties.armorBonus"
												type="number"
												:label="getArmorBonusPower()"
												:readonly="!allowEdit"
												density="compact"
											></v-text-field>
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
									<template id="Equipment.DamageResistance" v-if="helpers.itemType == 'equipment'">
										<v-row>
											<p class="h1">Damage Resistance and Susceptability</p>
											<v-container>
												<template v-for="resistance in props.item.equipmentProperties.resistances">
													<v-row no-gutters>
														<v-col cols="4">
															<v-autocomplete
																label="Type"
																:items="damageTypes"
																v-model="resistance.damageType"
																variant="solo"
																v-bind:readonly="!allowEdit"
															></v-autocomplete>
														</v-col>

														<v-col cols="2">
															<v-text-field
																v-model="resistance.value"
																v-bind:readonly="!allowEdit"
																type="number"
																label="Value"
																variant="solo"
															></v-text-field>
														</v-col>
														<v-btn
															style="margin-bottom: 10px"
															color="red"
															variant="plain"
															icon="mdi-delete-outline"
															size="small"
															@click.stop="removeResistance(resistance)"
														>
														</v-btn>
													</v-row>
												</template>
												<v-btn color="green" variant="text" @click="addResistance()">Add Damage Type</v-btn>
											</v-container>
										</v-row>
									</template>

									<template id="Equipment.Requirement" v-if="helpers.hasRequirement">
										<v-row style="margin-top: 50px">
											<p class="h1">Attribute Requirements</p>
											<v-container>
												<template v-for="req in props.item.equipmentProperties.attributeRequirement">
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
															<v-text-field
																v-model="req.level"
																v-bind:readonly="!allowEdit"
																type="number"
																label="Level"
																variant="solo"
															></v-text-field>
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
												<v-btn color="green" variant="text" @click="addRequirement()">Add Requirement</v-btn>
											</v-container>
										</v-row>
									</template>
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
	import { joinString } from "@/plugins/Utils";
	import {
		DamageTypes,
		getMatchingLocation,
		IItem,
		ILocation,
		WeaponTypes,
		EquipmentSlots,
		DEFAULT_WEAPON,
		DEFUALT_EQUIPMENT,
		WeaponHandling,
		IDamageResistance,
	} from "@/types/SwrpgTypes";
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
			helpers.itemType = "weapon";
			if (!props.item.weaponProperties) {
				props.item.weaponProperties = DEFAULT_WEAPON();
			}
		} else if (["Armour", "Clothing"].includes(props.item.category)) {
			helpers.itemType = "equipment";
			if (!props.item.equipmentProperties) {
				props.item.equipmentProperties = DEFUALT_EQUIPMENT();
			}
		}
	}

	function getArmorBonusPower(): string {
		const bonus = props.item.equipmentProperties.armorBonus;
		const slots = props.item.equipmentProperties.slot.length;

		const score = bonus / slots;
		if (score >= 0) return `Armor Bonus (Average)`;
		if (score <= 1) return `Armor Bonus (Low)`;
		if (score <= 2) return `Armor Bonus (Moderate)`;
		if (score <= 3) return `Armor Bonus (High)`;
		if (score >= 4) return `Armor Bonus (Very High)`;
		else return "Armor Bonus (Extreme)";
	}

	function getWeaponHandlingPower(): string {
		const handling = props.item.weaponProperties.handling;
		if (handling <= 0.5) return `Handling (Terrible)`;
		if (handling <= 0.75) return `Handling (Poor)`;
		if (handling <= 1) return `Handling (Average)`;
		if (handling <= 1.25) return `Handling (Good)`;
		if (handling <= 1.5) return `Handling (Great)`;
		else return `Handling (Extreme)`;
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
		{ title: "Custom", value: 1 },
	];

	//TODO provide different values based on type ie Torso should be highest
	const armorBonus = [{ title: "Average (None)", value: 0 }, { title: "Low", value: 1 }, { title: "Moderate", value: 2 }, { title: "High", value: 3 }, { title: "Custom" }];

	const equipmentSlots = computed(() => {
		const options = [];

		for (const slot in EquipmentSlots) {
			if (slot == "primaryWeapon") continue;
			if (Object.prototype.hasOwnProperty.call(EquipmentSlots, slot)) {
				options.push({
					title: EquipmentSlots[slot].name,
					value: EquipmentSlots[slot].key,
				});
			}
		}

		return options;
	});

	const minDamageRules = computed(() => {
		return [
			(v) => (v && v >= 1) || "Minimum damage must be at least 1",
			(v) => (v && v <= props.item.weaponProperties.maxDamage) || "Min Damage cannot be higer than Max Damage",
		];
	});

	const maxDamageRules = computed(() => {
		return [
			(v) => (v && v <= 25) || "Max damage must not be higher thant 25",
			(v) => (v && v >= props.item.weaponProperties.minDamage) || "Max Damage cannot be lower than Min Damage",
		];
	});

	function addRequirement() {
		const newRequirement = {
			attribute: "Strength",
			level: 1,
		};

		if (helpers.itemType == "weapon") {
			if (!props.item.weaponProperties.attributeRequirement) props.item.weaponProperties.attributeRequirement = [];
			props.item.weaponProperties.attributeRequirement.push(newRequirement);
		} else if (helpers.itemType == "equipment") {
			if (!props.item.equipmentProperties.attributeRequirement) props.item.equipmentProperties.attributeRequirement = [];
			props.item.equipmentProperties.attributeRequirement.push(newRequirement);
		}
	}

	function removeRequirement(requirement: { attribute: string; level: number }) {
		if (helpers.itemType == "weapon") {
			props.item.weaponProperties.attributeRequirement = props.item.weaponProperties.attributeRequirement.filter((e) => e != requirement);
			if (props.item.weaponProperties.attributeRequirement.length == 0) delete props.item.weaponProperties.attributeRequirement;
		} else if (helpers.itemType == "equipment") {
			props.item.equipmentProperties.attributeRequirement = props.item.equipmentProperties.attributeRequirement.filter((e) => e != requirement);
			if (props.item.equipmentProperties.attributeRequirement.length == 0) delete props.item.equipmentProperties.attributeRequirement;
		}
	}

	function addResistance() {
		const newResistance: IDamageResistance = {
			damageType: DamageTypes.Energy,
			value: 1,
		};

		if (!props.item.equipmentProperties.resistances) props.item.equipmentProperties.resistances = [];
		props.item.equipmentProperties.resistances.push(newResistance);
	}

	function removeResistance(resistance: IDamageResistance) {
		props.item.equipmentProperties.resistances = props.item.equipmentProperties.resistances.filter((e) => e != resistance);
		if (props.item.equipmentProperties.resistances.length == 0) delete props.item.equipmentProperties.resistances;
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
		itemType: "item" | "weapon" | "equipment" | "consumable";
	}

	const initialState: IHelpers = {
		aliasString: "",
		tradeAvailableEverywhere: true,
		hasRequirement: false,
		tradeMode: "whitelist",
		tradeLocationIds: [],
		itemType: "item",
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

		if (props.item.weaponProperties) helpers.itemType = "weapon";
		else if (props.item.equipmentProperties) helpers.itemType = "equipment";
		else helpers.itemType = "item";

		Object.assign(helpers, JSON.parse(JSON.stringify(newState)));
	}

	watch(
		() => props.item._id,
		(newVal, oldVal) => {
			setHelper();
		},
	);
</script>
