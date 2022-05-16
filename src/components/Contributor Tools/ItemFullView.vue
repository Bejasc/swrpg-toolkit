<template>
	<v-col sm="12" justify="center">
		<v-dialog v-model="show" width="unset">
			<v-card>
				<v-card-title>
					<span class="text-h5">Item</span>
				</v-card-title>
				<v-card-text>
					<v-row class="pt-4">
						<v-col sm="8">
							<v-col sm="8">
								<v-text-field v-model="item.name" v-if="allowEdit" label="Name*" outlined dense required></v-text-field>
								<v-text-field v-else label="Name*" readonly outlined dense :value="item.name"></v-text-field>
							</v-col>
							<v-col sm="4">
								<v-text-field v-model="item.category" v-if="allowEdit" label="Category" outlined dense required></v-text-field>
								<v-text-field v-model="item.category" v-else label="Category" readonly outlined dense required></v-text-field>
							</v-col>
							<v-col sm="8">
								<v-text-field v-model="aliasString" v-if="allowEdit" label="Aliases" outlined dense></v-text-field>
								<v-text-field v-else label="Aliases" readonly outlined dense required :value="getItemAliases()"></v-text-field>
							</v-col>
							<!-- <v-col sm="4">
									<v-text-field
										v-model="item.encumbrance"
										v-if="allowEdit"
										label="Encumbrance"
										type="number"
										outlined
										dense
										step="0.1"
										min="0"
										max="40"
									></v-text-field>
									<v-text-field v-model="item.encumbrance" v-else label="Encumbrance" readonly outlined dense></v-text-field>
								</v-col> -->
							<v-col sm="12">
								<v-textarea v-model="item.description" v-if="allowEdit" label="Description" dense required outlined></v-textarea>
								<v-textarea v-else label="Description*" readonly dense outlined required :value="item.description"></v-textarea>
							</v-col>
						</v-col>
						<v-col sm="4">
							<img :src="item.image" v-if="item.image" class="itemThumbnail" @click="changeItemImage()" />
							<img
								v-else
								src="https://cdn.discordapp.com/attachments/864064937521184788/864476989196468264/badge_random.png"
								alt=""
								class="itemThumbnail"
								@click="changeItemImage()"
							/>
						</v-col>
					</v-row>
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
	</v-col>
</template>

<style scoped>
.itemThumbnail {
	object-fit: contain;
	max-width: 220px;
	max-height: 220px;
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
			const imageUrl = prompt("Enter the URL for the new image", this.item.image);
			if (imageUrl != null) this.item.image = imageUrl;
		},
	},
});
</script>
