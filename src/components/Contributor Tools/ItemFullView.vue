<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent>
			<v-card class="pa-4">
				<v-card-text>
					<v-container>
						<v-row no-gutters>
							<v-col cols="8">
								<v-text-field label="Item Name*" v-model="item.name" density="compact" required></v-text-field>

								<!-- <div>
									<div class="text-caption">Encumbrance</div>
									<v-slider v-model="item.encumbrance" min="0" max="30" step="0.5" color="red" thumb-label prepend-icon="mdi-weight">
										<template v-slot:append>
											<v-text-field
												v-model="item.encumbrance"
												type="number"
												style="width: 90px"
												density="compact"
												hide-details
												variant="outlined"
											></v-text-field>
										</template>
									</v-slider>
								</div> -->
								<v-row>
									<v-col cols="6">
										<v-autocomplete v-model="item.category" :items="itemCategories" label="Category" density="compact"></v-autocomplete>
									</v-col>
									<v-col cols="6">
										<v-text-field v-model="item.encumbrance" prepend-inner-icon="mdi-weight" type="number" label="Encumbrance" density="compact"></v-text-field>
									</v-col>
								</v-row>
							</v-col>
							<v-col cols="4" style="margin-top: -30px">
								<v-img :src="item.image" class="itemThumbnail" width="140px" @click="changeItemImage()" />
								<div align="center" class="text-caption font-italic">Click image to change</div>
							</v-col>
							<v-col cols="12" class="pt-6">
								<v-textarea v-model="item.description" label="Description" required rows="2"></v-textarea>
							</v-col>
						</v-row>
						<v-checkbox v-if="allowEdit" v-model="isTradeable" :label="`Is Tradeable: ${isTradeable ? 'Yes' : 'No'}`"></v-checkbox>
						<div id="tradeProperties" v-if="isTradeable">
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

									<!-- <div class="text-caption">Base Value (Credits)</div>

									<v-slider v-model="item.tradeProperties.baseValue" min="0" max="100000" step="5" color="yellow" thumb-label prepend-icon="mdi-cash">
										<template v-slot:append>
											<v-text-field
												v-model="item.tradeProperties.baseValue"
												type="number"
												style="width: 150px"
												density="compact"
												hide-details
												variant="outlined"
											></v-text-field>
										</template>
									</v-slider> -->
								</v-col>
							</v-row>
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
import type IItem from "@/types/SwrpgTypes/IItem";
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
	},
	data: () => {
		return {
			itemCategories: ["Unknown", "Food", "Armour", "Weapons", "Medical"],
			aliasString: "",
			isTradeable: false,
			itemRarities: ["Abundant", "Common", "Uncommon", "Rare", "Legendary", "Unique"],
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
