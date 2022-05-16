<template>
	<v-col cols="11">
		<v-card>
			<v-card-title class="d-flex">
				{{ itemPackageData.packageInfo.name }} ({{ itemPackageData.items.length }} Items)
				<v-spacer />
				<v-card-actions>
					<div>
						<v-btn variant="outlined" color="green" outline>Export</v-btn>
						<v-btn variant="outlined" color="red" outline>Clear</v-btn>
					</div>
				</v-card-actions>
			</v-card-title>
			<v-expansion-panels variant="accordion">
				<!--EXTRACT ME-->
				<v-expansion-panel title="Package Info" color="red-darken-3">
					<v-expansion-panel-text>
						<v-row class="pt-4">
							<!--Title-->
							<v-col sm="6">
								<v-text-field v-model="itemPackageData.packageInfo.name" v-if="allowEdit" label="Package Name*" outlined dense required></v-text-field>
								<v-text-field v-else label="Package Name*" readonly outlined dense :value="itemPackageData.packageInfo.name"></v-text-field>
							</v-col>

							<!--Author-->
							<v-col sm="6">
								<v-text-field v-model="itemPackageData.packageInfo.author" v-if="allowEdit" label="Author*" outlined dense required></v-text-field>
								<v-text-field v-else label="Author*" readonly outlined dense :value="itemPackageData.packageInfo.author"></v-text-field>
							</v-col>
						</v-row>

						<!--Description-->
						<v-row dense>
							<v-col sm="12">
								<v-text-field v-model="itemPackageData.packageInfo.description" v-if="allowEdit" label="Description" outlined dense required></v-text-field>
								<v-text-field v-else label="Description" readonly outlined dense :value="itemPackageData.packageInfo.description"></v-text-field>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<!--EXTRACT ME END-->
				<v-expansion-panel title="Items">
					<v-expansion-panel-text class="ma-2">
						<v-row style="max-height: 550px" class="overflow-y-auto">
							<v-col v-for="item in itemPackageData.items" :key="item._id" cols="2">
								<v-card width="200px">
									<v-img
										:src="item.image"
										:lazy-src="item.image"
										contain
										class="white--text imageMouseover"
										gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
										height="200px"
									>
										<!-- <div v-if="item.isVerified" class="float-left pa-3">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-icon color="#91FFFF" v-bind="attrs" v-on="on">mdi-check-decagram</v-icon>
								</template>
								<span>Thie Item exists in the SWRPG Database</span>
							</v-tooltip>
						</div> -->

										<!-- <v-icon class="float-right pa-3">mdi-dots-vertical</v-icon> -->
									</v-img>
									<v-card-actions>
										<span class="subtitle-1">
											{{ item.name }}
										</span>

										<v-spacer />

										<!-- <v-btn icon>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon v-bind="attrs" v-on="on">mdi-shape</v-icon>
									</template>
									<span>{{ item.category }}</span>
								</v-tooltip>
							</v-btn> -->
									</v-card-actions>
								</v-card>
							</v-col>

							<v-col cols="1">
								<v-card style="border: 3px dashed grey" width="200px" @click="addNewItem">
									<v-icon size="200px" color="grey">mdi-plus</v-icon>
								</v-card>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card>
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
import type { IPackageDefinitionItem } from "@/types/packages/ItemPackage";
import type IItem from "@/types/SwrpgTypes/IItem";
import { defineComponent } from "vue";

// Components
export default defineComponent({
	name: "Item Package Creator",
	emits: ["pageNavigation"],
	data: () => {
		return {
			allowEdit: true,
			itemPackageData: {
				packageInfo: {
					name: "New Item Package",
				},
				items: [] as IItem[],
			} as IPackageDefinitionItem,
		};
	},
	methods: {
		addNewItem() {
			this.itemPackageData.items.push({
				_id: "abc123",
				category: "Unknown",
				name: "New Item",
				image: "https://cdn.discordapp.com/attachments/964554539539771412/969787653102899220/crate.png",
			});
		},
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);
	},
});
</script>
