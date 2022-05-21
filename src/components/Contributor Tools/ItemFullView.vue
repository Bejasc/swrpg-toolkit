<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent>
			<v-card class="pa-4">
				<v-card-title>
					<span class="text-h5">Item</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="8">
								<v-text-field label="Item Name*" required></v-text-field>
								<v-autocomplete v-model="item.category" :items="itemCategories" label="Category"></v-autocomplete>
								<!-- <v-slider v-model="item.encumbrance" class="pt-3" min="0" max="30" step="0.5" color="red" thumb-label>
									<template v-slot:append>
										<v-text-field v-model="item.encumbrance" type="number" style="width: 80px" density="compact" hide-details variant="outlined"></v-text-field>
									</template>
								</v-slider> -->
							</v-col>
							<v-col cols="4">
								<v-img :src="item.image" class="itemThumbnail" width="250px" @click="changeItemImage()" />
							</v-col>
							<v-col cols="12">
								<v-textarea v-model="item.description" label="Description" dense required outlined></v-textarea>
							</v-col>
						</v-row>
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

			this.$emit("itemAdded", this.item);
			(this.$parent as any).showLoader = false;
		},
		changeItemImage() {
			//TODO Change to dialog
			const imageUrl = prompt("Enter the URL for the new image", this.item.image);
			if (imageUrl != null) this.item.image = imageUrl;
		},
	},
});
</script>
