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
												v-model="aliasString"
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
											v-model="marketProperties.availableEverywhere"
											:label="`Is Available Everywhere: ${marketProperties.availableEverywhere ? 'Yes' : 'No'}`"
											:readonly="!allowEdit"
											v-if="allowEdit == true"
										></v-checkbox>
										<!-- <v-switch v-model="marketHelper.isWhitelist" :label="`Treat list as ${marketHelper.isWhitelist ? 'Whitelist' : 'Blacklist'}`"> </v-switch> -->
										<v-radio-group
											inline
											v-if="!marketProperties.availableEverywhere && allowEdit == true"
											v-model="marketProperties.mode"
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
									<v-col cols="12" v-if="!marketProperties.availableEverywhere && allowEdit == true">
										<LocationPicker @selection-changed="selectedLocationsChanged"></LocationPicker>
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

<script lang="ts">
import LocationPicker from "@/components/LocationSelector.vue";
import { IItem, ILocation } from "@/types/SwrpgTypes";
import { ITradeProperties } from "drpg-economy/dist/types/IDrpgItemBase";
import { defineComponent, type PropType } from "vue";

interface IMarketProperties {
	availableEverywhere: boolean;
	mode: "blacklist" | "whitelist";
	locationNames: string;
	//Location IDs?
}

export default defineComponent({
	name: "ItemFullView",
	components: { LocationPicker },
	props: {
		show: Boolean,
		item: {
			type: Object as PropType<IItem>,
			required: true,
		},
		allowEdit: Boolean,
		locations: {
			type: Object as PropType<ILocation[]>,
		},
	},
	data: () => {
		return {
			itemCategories: [
				"Unknown",
				"Food",
				"Armour",
				"Weapons",
				"Medical",
				"Tools",
				"Clothing",
				"Resources",
				"Minerals",
				"Luxuries",
				"Waste",
				"Technology",
				"Salvage",
				"Chemicals",
			],
			aliasString: "",
			itemRarities: ["Abundant", "Common", "Uncommon", "Rare", "Legendary", "Unique"],
			marketProperties: {
				availableEverywhere: false,
				mode: "blacklist",
				locationNames: "",
			},
		};
	},
	computed: {
		marketHelperText(): string {
			const locationNames = this.marketProperties.locationNames.length > 0 ? this.marketProperties.locationNames : "selected locations";
			if (this.marketProperties.availableEverywhere) {
				return `${this.item.name} can be bought and sold everywhere.`;
			} else {
				if (this.marketProperties.mode === "whitelist") {
					return `${this.item.name} can *ONLY* be bought and sold on ${locationNames}.`;
				} else {
					return `${this.item.name} can be bought and sold everywhere *EXCEPT* on ${locationNames}`;
				}
			}
		},
	},
	methods: {
		getItemAliases(): string {
			return this.item.aliases?.join(", ") ?? "";
		},
		async saveNewItem() {
			const a = this.aliasString.replace(" ", "").split(",");

			this.item.aliases = a;

			this.$emit("saveItem", this.item);
		},
		changeItemImage() {
			if (!this.allowEdit) return;

			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.item.image);
			if (imageUrl != null) this.item.image = imageUrl;
		},
		whitelistModeChanged(val) {
			const tradeProperties: ITradeProperties = this.item.tradeProperties;

			if (val === "whitelist") {
				(tradeProperties.locationWhitelist = tradeProperties.locationBlacklist), (tradeProperties.locationBlacklist = undefined);
			} else {
				(tradeProperties.locationBlacklist = tradeProperties.locationWhitelist), (tradeProperties.locationWhitelist = undefined);
			}
		},
		selectedLocationsChanged(newValue?: string[]) {
			const tradeProperties: ITradeProperties = this.item.tradeProperties;

			this.marketProperties.locationNames = this.getLocationNames(newValue);

			if (this.marketProperties.mode === "whitelist") {
				console.log(`${this.item.name} trade whitelist set to ${this.marketProperties.locationNames}`);
				tradeProperties.locationWhitelist = newValue;
			} else {
				console.log(`${this.item.name} trade blacklist set to ${this.marketProperties.locationNames}`);
				tradeProperties.locationBlacklist = newValue;
			}
		},
		getLocationNames(ids: string[]): string {
			const matchingLocations = this.locations.filter((e) => ids.includes(e._id));
			return matchingLocations.map((e) => e.name).join(", ");
		},
	},
	mounted() {
		const tradeProperties: ITradeProperties = this.item.tradeProperties;

		if (tradeProperties) {
			if (tradeProperties.locationBlacklist?.length > 0 || tradeProperties.locationWhitelist?.length > 0) {
				//Set available everywhere false
				this.marketProperties.availableEverywhere = false;
				if (tradeProperties.locationWhitelist?.length > 0) {
					this.marketProperties.mode = "whitelist";
				} else {
					this.marketProperties.mode = "blacklist";
				}

				this.marketProperties.locationNames = this.getLocationNames([...tradeProperties.locationBlacklist, ...tradeProperties.locationWhitelist]);
			} else {
				this.marketProperties.availableEverywhere = true;
			}
		}

		if (this.item?.aliases?.length > 0) this.aliasString = this.getItemAliases();
	},
});
</script>
