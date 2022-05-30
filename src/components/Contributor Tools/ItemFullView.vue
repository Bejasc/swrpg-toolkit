<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200px">
			<v-card class="pa-4" :title="item.name">
				<v-card-text>
					<v-container>
						<v-row no-gutters>
							<v-col cols="8">
								<v-text-field label="Item Name*" :readonly="!allowEdit" v-model="item.name" density="compact" required></v-text-field>
								<v-row>
									<v-col cols="6">
										<v-autocomplete v-model="item.category" :readonly="!allowEdit" :items="itemCategories" label="Category" density="compact"></v-autocomplete>
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
							</v-col>
							<v-col cols="4" style="margin-top: -30px">
								<v-img :src="item.image" :disabled="!allowEdit" class="itemThumbnail" width="140px" @click="changeItemImage()" />
								<div v-if="allowEdit" align="center" class="text-caption font-italic">Click image to change</div>
							</v-col>
							<v-col cols="12" class="pt-6">
								<v-textarea v-model="item.description" :readonly="!allowEdit" label="Description" required rows="2"></v-textarea>
							</v-col>
						</v-row>

						<v-col cols="4">
							<v-checkbox v-if="allowEdit" v-model="isTradeable" :label="`Is Tradeable: ${isTradeable ? 'Yes' : 'No'}`"></v-checkbox>
						</v-col>

						<div id="tradeProperties" v-if="isTradeable">
							<v-row no-gutters>
								<v-col cols="5" class="px-2">
									<v-select :items="itemRarities" v-model="item.tradeProperties.itemRarity" label="Rarity" density="compact"></v-select>
								</v-col>
								<v-col cols="7" class="px-2">
									<v-text-field
										v-model="item.tradeProperties.baseValue"
										prepend-inner-icon="mdi-cash"
										type="number"
										label="Base Value"
										density="compact"
									></v-text-field>
								</v-col>

								<v-col cols="6" v-if="isTradeable">
									<v-checkbox
										v-model="marketHelper.isAvailableEverywhere"
										:label="`Is Available Everywhere: ${marketHelper.isAvailableEverywhere ? 'Yes' : 'No'}`"
									></v-checkbox>
								</v-col>
								<v-col cols="5" v-if="!marketHelper.isAvailableEverywhere">
									<!-- <v-switch v-model="marketHelper.isWhitelist" :label="`Treat list as ${marketHelper.isWhitelist ? 'Whitelist' : 'Blacklist'}`"> </v-switch> -->
									<v-switch v-model="marketHelper.isWhitelist">
										<template v-slot:label>
											<span v-if="marketHelper.isWhitelist">Treat list as Whitelist</span>
											<span v-else>Treat list as Blacklist</span>
											<v-tooltip bottom>
												<template v-slot:activator="{ props }">
													<v-icon v-bind="props" v-on="props"> mdi-help </v-icon>
												</template>
												<span v-if="marketHelper.isWhitelist">This item will appear <b>only on</b> Locations shown below</span>
												<span v-else>This item will appear everywhere <b>except</b> on Locations shown below</span>
											</v-tooltip>
										</template>
									</v-switch>
								</v-col>

								<v-col cols="12" v-if="!marketHelper.isAvailableEverywhere">
									<v-card :title="`Locations ${marketHelper.isWhitelist ? 'Whitelist' : 'Blacklist'}`" color="grey-darken-3" flat tile>
										<v-row style="max-height: 250px" class="mx-3 overflow-y-auto" no-gutters>
											<v-col cols="4" v-for="loc in locations">
												<v-card class="ma-1 pa-2" outlined flat @click="">
													<v-row no-gutters style="flex-wrap: nowrap">
														<v-col cols="2" class="flex-grow-0 flex-shrink-0">
															<div style="display: flex; align-items: center; height: 100%">
																<v-img :src="loc.planetImage"></v-img>
															</div>
														</v-col>
														<v-col cols="8" style="min-width: 100px; max-width: 80%" class="pl-4 flex-gorw-1 flex-shrink-0">
															<div style="display: flex; align-items: center; height: 100%">
																{{ loc.name }}
															</div>
														</v-col>
														<v-col cols="1" style="min-width: 100px" class="flex-grow-0 flex-shrink-1">
															<v-checkbox hide-details></v-checkbox>
														</v-col>
													</v-row>
												</v-card>
											</v-col>
										</v-row>
									</v-card>
								</v-col>
							</v-row>
							<!-- <v-row>
								<v-expansion-panels>
									<v-expansion-panel title="Market Overrides" color="blue">
										<v-expansion-panel-text> </v-expansion-panel-text>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-row> -->
						</div>
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
import { MarketHelper } from "@/types/MarketHelper";
import type IItem from "@/types/SwrpgTypes/IItem";
import type { ILocation } from "@/types/SwrpgTypes/ILocation";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "ItemFullView",
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
			itemCategories: ["Unknown", "Food", "Armour", "Weapons", "Medical"],
			aliasString: "",
			isTradeable: false,
			itemRarities: ["Abundant", "Common", "Uncommon", "Rare", "Legendary", "Unique"],
			marketHelper: new MarketHelper(),
		};
	},
	methods: {
		getItemAliases(): string {
			return this.item.aliases?.join(", ") ?? "";
		},
		async saveNewItem() {
			(this.$parent as any).showLoader = true;
			const a = this.aliasString.replace(" ", "").split(",");

			this.item.aliases = a;

			if (!this.isTradeable) this.item.tradeProperties = undefined;

			this.$emit("itemAdded", this.item);
			(this.$parent as any).showLoader = false;
		},
		changeItemImage() {
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.item.image);
			if (imageUrl != null) this.item.image = imageUrl;
		},
	},
	mounted() {
		if (this.item.tradeProperties) this.isTradeable = true;
	},
});
</script>
