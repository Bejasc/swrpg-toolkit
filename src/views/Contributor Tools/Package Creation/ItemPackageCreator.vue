<template>
	<v-col cols="11">
		<v-card>
			<v-card-title class="d-flex">
				{{ packageData.packageInfo.name }} ({{ packageData.items.length }} Items)
				<v-spacer />
				<v-card-actions>
					<div>
						<v-btn variant="outlined" color="green" outline @click="exportPackage"> <v-icon icon="mdi-content-save-outline" /> Save </v-btn>

						<v-btn variant="outlined" color="blue" outline>
							<v-icon icon="mdi-cloud-upload-outline" /> Load
							<v-dialog v-model="dialog" activator="parent" transition="fade-transition">
								<v-card>
									<v-card-text>
										You can import an existing Package by pasting the text below and selecting Import

										<v-textarea v-model="pastedPackage" class="mt-4" clearable clear-icon="mdi-close-circle" label="Package JSON"></v-textarea>
									</v-card-text>
									<v-card-actions>
										<v-spacer />
										<v-btn color="red" @click="dialog = false">Cancel</v-btn>
										<v-btn color="success" @click="importPackage">Import</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-btn>
						<v-btn variant="outlined" color="red" outline>
							<v-icon icon="mdi-delete-outline" /> Clear

							<v-dialog v-model="dialogConfirmClear" activator="parent" transition="fade-transition" persistent>
								<v-card>
									<v-card-text> Are you sure you want to remove the Package Info and all of the Package Items? This cannot be undone </v-card-text>
									<v-card-actions>
										<v-spacer />
										<v-btn color="blue" @click="dialogConfirmClear = false">Cancel</v-btn>
										<v-btn color="red" @click="clearAll">Clear Package</v-btn>
										<!--TODO emit from extracted component-->
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-btn>
					</div>
				</v-card-actions>
			</v-card-title>
			<v-expansion-panels variant="accordion" multiple v-model="panels">
				<!--EXTRACT ME-->
				<v-expansion-panel title="Package Info" color="red-darken-3">
					<v-expansion-panel-text>
						<v-row class="pt-4">
							<!--Title-->
							<v-col sm="6">
								<v-text-field v-model="packageData.packageInfo.name" v-if="allowEdit" label="Package Name*" outlined dense required></v-text-field>
								<v-text-field v-else label="Package Name*" readonly outlined dense :value="packageData.packageInfo.name"></v-text-field>
							</v-col>

							<!--Author-->
							<v-col sm="6">
								<v-text-field v-model="packageData.packageInfo.author" v-if="allowEdit" label="Author*" outlined dense required></v-text-field>
								<v-text-field v-else label="Author*" readonly outlined dense :value="packageData.packageInfo.author"></v-text-field>
							</v-col>
						</v-row>

						<!--Description-->
						<v-row dense>
							<v-col sm="12">
								<v-text-field v-model="packageData.packageInfo.description" v-if="allowEdit" label="Description" outlined dense required></v-text-field>
								<v-text-field v-else label="Description" readonly outlined dense :value="packageData.packageInfo.description"></v-text-field>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<!--EXTRACT ME END-->
				<v-expansion-panel title="Items">
					<v-expansion-panel-text class="ma-2">
						<v-row style="max-height: 550px" class="overflow-y-auto">
							<v-col v-for="item in packageData.items" :key="item._id" cols="2">
								<v-card width="200px" @click="openItem(item, false)">
									<v-img
										:src="item.image"
										:lazy-src="item.image"
										contain
										class="white--text imageMouseover"
										gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
										height="200px"
									>
										<v-menu anchor="bottom">
											<template v-slot:activator="{ props }">
												<v-btn class="float-right" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
											</template>
											<v-list>
												<v-list-item
													title="View"
													@click="
														openItem(item, false);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Duplicate"
													@click="
														duplicateItem(item);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Remove"
													@click="
														removeItem(item);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Edit"
													@click="
														openItem(item, true);
														showContextMenu = false;
													"
												/>
											</v-list>
										</v-menu>
									</v-img>
									<v-card-actions color="red">
										<span class="subtitle-1">
											{{ item.name }}
										</span>
									</v-card-actions>
								</v-card>
							</v-col>

							<v-col cols="1">
								<v-card style="border: 3px dashed grey" width="200px" @click="openItem(undefined, true)">
									<v-icon size="200px" color="grey">mdi-plus</v-icon>
								</v-card>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card>

		<ItemFullView
			:show="dialogItemFullView"
			:item="selectedItem"
			:locations="locations"
			:allowEdit="allowEdit"
			@saveItem="saveItem($event)"
			@closeFullView="dialogItemFullView = false"
		/>
	</v-col>
</template>

<style scoped>
.imageMouseover {
	filter: brightness(100%) blur(0.5px);
	-webkit-transition: -webkit-filter 200ms linear;
}
.imageMouseover:hover {
	cursor: pointer;

	filter: brightness(115%) blur(0px);
	-webkit-transition: -webkit-filter 200ms linear;
}
</style>

<script lang="ts">
import ItemFullView from "@/components/Contributor Tools/ItemFullView.vue";
import { getData } from "@/plugins/MongoConnector";
import { stringToCamelCase } from "@/plugins/Utils";
import type { IPackageDefinition } from "@/types/packages/ItemPackage";
import { IItem, ILocation } from "@/types/SwrpgTypes";
import FileSaver from "file-saver";
import mongoose from "mongoose";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "Item Package Creator",
	emits: ["pageNavigation"],
	components: { ItemFullView },
	data: () => {
		return {
			panels: [0, 1],
			incompleteSnackbar: true,
			selectedItem: {} as IItem,
			dialog: false,
			dialogConfirmClear: false,
			dialogItemFullView: false,
			showContextMenu: false,
			allowEdit: true,
			pastedPackage: "",
			packageData: {
				packageInfo: {},
				items: [] as IItem[],
			} as IPackageDefinition,
			locations: [] as ILocation[],
		};
	},
	methods: {
		clearAll() {
			this.dialogConfirmClear = false;
			this.packageData = {
				packageInfo: {},
				items: [] as IItem[],
			} as IPackageDefinition;
		},
		saveItem(item: IItem) {
			this.dialogItemFullView = false;

			const existingItem = this.packageData.items.find((e) => e._id === item._id);

			if (existingItem) {
				const i = this.packageData.items.indexOf(existingItem);
				this.packageData.items[i] = item;
			} else {
				this.packageData.items.push(item);
			}
		},
		duplicateItem(item: IItem) {
			const newObj: IItem = JSON.parse(JSON.stringify(item));
			newObj._id = new mongoose.Types.ObjectId().toString();
			this.packageData.items.push(newObj);
		},
		removeItem(item: IItem) {
			this.packageData.items = this.packageData.items.filter((e) => e._id !== item._id);
		},
		openItem(item?: IItem, editMode = true) {
			console.log(item?.name ?? "Create new Item", editMode);

			if (!item)
				item = {
					_id: new mongoose.Types.ObjectId().toString(),
					category: "Unknown",
					name: "New Item",
					description: "Not much is known about this item.",
					image: "https://cdn.discordapp.com/attachments/964554539539771412/969787653102899220/crate.png",
					encumbrance: 1,
					tradeProperties: {
						isTradeable: true,
						baseValue: 100,
						itemRarity: "Common",
					},
				};

			this.dialogItemFullView = true;

			this.selectedItem = item;
			this.allowEdit = editMode;
		},
		exportPackage() {
			if (!this.packageData.packageInfo.name || !this.packageData.packageInfo.author) {
				alert("Please complete the required Package Info");
				return;
			}

			const fileName = `${stringToCamelCase(this.packageData.packageInfo.author)}.${stringToCamelCase(this.packageData.packageInfo.name)}`;

			const packageAsJson = JSON.stringify(this.packageData, null, "\t");

			var blob = new Blob([packageAsJson], { type: "text/plain;charset=utf-8" });
			FileSaver.saveAs(blob, `${fileName}.items.json`);
			// navigator.clipboard.writeText(packageAsJson);
			// alert(`${this.itemPackageData.packageInfo.name} has been copied to your clipboard with ${this.itemPackageData.items.length} items.`);
		},
		importPackage() {
			this.dialog = false;
			const packageFromJson = JSON.parse(this.pastedPackage) as IPackageDefinition;
			this.packageData = packageFromJson;
			this.pastedPackage = "";
		},
		async loadAllLocations() {
			this.showLoader = true;
			this.locations = [];
			this.locations = await getData<ILocation>("location");

			this.showLoader = false;
		},
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);
		this.loadAllLocations();
	},
});
</script>
