<template>
	<v-col cols="11">
		<v-card>
			<v-card-title class="d-flex">
				{{ packageData.packageInfo.name }} ({{ packageData.locations.length }} Locations)
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
									<v-card-text> Are you sure you want to remove the Package Info and all of the Package Locations? This cannot be undone </v-card-text>
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
				<v-expansion-panel title="Locations">
					<v-expansion-panel-text class="ma-2">
						<v-row style="max-height: 550px" class="overflow-y-auto">
							<v-col v-for="locData in packageData.locations" :key="locData.location._id" cols="2">
								<v-card width="200px" @click="openLocation(locData, false)">
									<v-img
										:src="locData.location.planetImage"
										:lazy-src="locData.location.planetImage"
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
														openLocation(locData, false);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Duplicate"
													@click="
														duplicateLocation(locData);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Remove"
													@click="
														removeLocation(locData);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Edit"
													@click="
														openLocation(locData, true);
														showContextMenu = false;
													"
												/>
											</v-list>
										</v-menu>
									</v-img>
									<v-card-actions color="red">
										<span class="subtitle-1">
											{{ locData.location.name }}
										</span>
									</v-card-actions>
								</v-card>
							</v-col>

							<v-col cols="1">
								<v-card style="border: 3px dashed grey" width="200px" @click="openLocation(null, true)">
									<v-icon size="200px" color="grey">mdi-plus</v-icon>
								</v-card>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card>
	</v-col>
	<LocationFullView :show="dialogFullView" :locData="selectedLocation" :allowEdit="allowEdit" @locationSaved="saveLocation($event)" @closeFullView="dialogFullView = false" />
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
import LocationFullView from "@/components/Contributor Tools/LocationFullView.vue";
import { stringToCamelCase } from "@/plugins/Utils";
import type { IPackageDefinition } from "@/types/packages/ItemPackage";
import { ISwrpgLocationData } from "@/types/SwrpgTypes";
import FileSaver from "file-saver";
import mongoose from "mongoose";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "Location Package Creator",
	emits: ["pageNavigation"],
	components: { LocationFullView },
	data: () => {
		return {
			panels: [0, 1],
			incompleteSnackbar: true,
			selectedLocation: {} as ISwrpgLocationData,
			dialog: false,
			dialogConfirmClear: false,
			dialogFullView: false,
			showContextMenu: false,
			allowEdit: true,
			pastedPackage: "",
			packageData: {
				packageInfo: {},
				locations: [],
			} as IPackageDefinition,
		};
	},
	methods: {
		clearAll() {
			this.dialogConfirmClear = false;
			this.packageData = {
				packageInfo: {},
				locations: [] as ISwrpgLocationData[],
			} as IPackageDefinition;
		},
		saveLocation(locData: ISwrpgLocationData) {
			this.dialogFullView = false;

			const existingLocation = this.packageData.locations.find((e) => e.location._id === locData.location._id);

			if (existingLocation) {
				const i = this.packageData.locations.indexOf(existingLocation);
				this.packageData.locations[i] = locData;
			} else {
				alert(`${locData.location._id} DIDNT MATCH ANY ${this.packageData.locations.map((e) => e.location._id).join(", ")}`);
				this.packageData.locations.push(locData);
			}
		},
		duplicateLocation(locData: ISwrpgLocationData) {
			const newObj: ISwrpgLocationData = JSON.parse(JSON.stringify(locData));
			newObj.location._id = new mongoose.Types.ObjectId().toString();
			if (newObj.market) {
				//TODO give market new ID
			}
			this.packageData.locations.push(newObj);
		},
		removeLocation(locData: ISwrpgLocationData) {
			this.packageData.locations = this.packageData.locations.filter((e) => e.location._id !== locData.location._id);
		},
		openLocation(locData?: ISwrpgLocationData, editMode = true) {
			console.log(locData?.location.name ?? "None");
			if (!locData)
				locData = {
					location: {
						_id: new mongoose.Types.ObjectId().toString(),
						coordinates: {
							hyperlaneProximity: 0,
							x: 0,
							y: 0,
						},
						name: "New Planet",
						image: "https://cdn.discordapp.com/attachments/964554539539771412/985579435317157918/unknown_environment.png",
						planetImage: "https://cdn.discordapp.com/attachments/964554539539771412/985578348191313990/unknown_planet.png",
						description: "Not much is known about this planet.",
						channelOptions: {
							name: "New Planet",
							autoCreate: true,
							category: "Planets",
						},
						initialPoints: [],
					},
				};

			this.dialogFullView = true;

			this.selectedLocation = locData;
			this.allowEdit = editMode;
		},
		exportPackage() {
			if (!this.packageData.packageInfo.name || !this.packageData.packageInfo.author) {
				alert("Please complete the required Package Info");
				return;
			}

			const packageAsJson = JSON.stringify(this.packageData, null, "\t");
			const fileName = `${stringToCamelCase(this.packageData.packageInfo.author)}.${stringToCamelCase(this.packageData.packageInfo.name)}`;

			var blob = new Blob([packageAsJson], { type: "text/plain;charset=utf-8" });
			FileSaver.saveAs(blob, `${fileName}.locations.json`);
			// navigator.clipboard.writeText(packageAsJson);
			// alert(`${this.itemPackageData.packageInfo.name} has been copied to your clipboard with ${this.itemPackageData.items.length} items.`);
		},
		importPackage() {
			this.dialog = false;
			const packageFromJson = JSON.parse(this.pastedPackage) as IPackageDefinition;
			this.packageData = packageFromJson;
			this.pastedPackage = "";
		},
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);
	},
});
</script>
