<template>
	<v-col cols="11">
		<v-card>
			<v-card-title class="d-flex">
				{{ packageData.packageInfo.name }} ({{ packageData.events.length }} Events)
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
									<v-card-text> Are you sure you want to remove the Package Info and all of the Package Events? This cannot be undone </v-card-text>
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
				<v-expansion-panel title="Events">
					<v-expansion-panel-text class="ma-2">
						<v-row style="max-height: 550px" class="overflow-y-auto">
							<v-col v-for="eventData in packageData.events" :key="eventData.id" cols="2">
								<v-card width="200px" @click="openEvent(eventData, false)">
									<v-img
										:src="eventData.embedOptions.image ?? eventData.embedOptions.thumbnail"
										:lazy-src="eventData.embedOptions.image ?? eventData.embedOptions.thumbnail"
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
														openEvent(eventData, false);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Duplicate"
													@click="
														duplicateEvent(eventData);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Remove"
													@click="
														removeEvent(eventData);
														showContextMenu = false;
													"
												/>
												<v-list-item
													title="Edit"
													@click="
														openEvent(eventData, true);
														showContextMenu = false;
													"
												/>
											</v-list>
										</v-menu>
									</v-img>
									<v-card-actions color="red">
										<span class="subtitle-1">
											{{ eventData.id }}
										</span>
									</v-card-actions>
								</v-card>
							</v-col>

							<v-col cols="1">
								<v-card style="border: 3px dashed grey" width="200px" @click="openEvent(null, true)">
									<v-icon size="200px" color="grey">mdi-plus</v-icon>
								</v-card>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card>
	</v-col>
	<EventFullView :show="dialogFullView" :eventData="selectedEvent" :allowEdit="allowEdit" @eventSaved="saveEvent($event)" @closeFullView="dialogFullView = false" />
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
import EventFullView from "@/components/Contributor Tools/Events/EventFullView.vue";
import { stringToCamelCase } from "@/plugins/Utils";
import type { IPackageDefinition } from "@/types/packages/ItemPackage";
import type { IEventBase } from "@/types/SwrpgTypes/IEventBase";
import FileSaver from "file-saver";
import mongoose from "mongoose";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "Event Package Creator",
	emits: ["pageNavigation"],
	components: { EventFullView },
	data: () => {
		return {
			panels: [0, 1],
			incompleteSnackbar: true,
			selectedEvent: {} as IEventBase,
			dialog: false,
			dialogConfirmClear: false,
			dialogFullView: false,
			showContextMenu: false,
			allowEdit: true,
			pastedPackage: "",
			packageData: {
				packageInfo: {},
				events: [],
			} as IPackageDefinition,
		};
	},
	methods: {
		clearAll() {
			this.dialogConfirmClear = false;
			this.packageData = {
				packageInfo: {},
				events: [] as IEventBase[],
			} as IPackageDefinition;
		},
		saveEvent(eventData: IEventBase) {
			// this.itemPackageData.items.push({
			// 	_id: new mongoose.Types.ObjectId().toString(),
			// 	category: "Unknown",
			// 	name: "New Item",
			// 	image: "https://cdn.discordapp.com/attachments/964554539539771412/969787653102899220/crate.png",
			// });
			this.dialogFullView = false;
			this.packageData.events.push(eventData);

			const existingEvent = this.packageData.events.find((e) => e.id === eventData.id);

			if (existingEvent) {
				const i = this.packageData.events.indexOf(existingEvent);
				this.packageData.events[i] = eventData;
			} else {
				this.packageData.events.push(eventData);
			}
		},
		duplicateEvent(eventData: IEventBase) {
			const newObj: IEventBase = JSON.parse(JSON.stringify(eventData));
			newObj.id = new mongoose.Types.ObjectId().toString();
			this.packageData.events.push(newObj);
		},
		removeEvent(eventdata: IEventBase) {
			this.packageData.events = this.packageData.events.filter((e) => e.id !== eventdata.id);
		},
		openEvent(eventData?: IEventBase, editMode = true) {
			if (!eventData)
				eventData = {
					id: new mongoose.Types.ObjectId().toString(),
					embedOptions: {
						color: "#E6A00E",
					},
					results: {
						pickRandom: false,
						changes: [],
					},
					eventLinks: [],
				};

			this.dialogFullView = true;

			this.selectedEvent = eventData;
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
			FileSaver.saveAs(blob, `${fileName}.events.json`);
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
