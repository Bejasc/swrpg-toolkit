<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel>
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					Fight Combat against {{ requirement.combat.nameOverride ?? requirement.combat.npc }}
					<v-spacer />
					<v-btn class="mx-3" color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeCombat()"> </v-btn>
				</template>
			</v-expansion-panel-title>
			<v-expansion-panel-text>
				<!--TODO: Existing or New toggle-->
				<v-row no-gutters>
					<v-radio-group inline v-if="allowEdit" v-model="npcMode" :readonly="!allowEdit">
						<v-radio label="Existing NPC" value="lookup"></v-radio>
						<v-radio label="New NPC" value="inline"></v-radio>
					</v-radio-group>
				</v-row>

				<template v-if="npcMode == 'lookup'">
					<v-row>
						<v-col cols="3">
							<v-text-field label="NPC Name (Lookup)" :readonly="!allowEdit" v-model="requirement.combat.npc" variant="solo"></v-text-field>
						</v-col>
						<v-col cols="4">
							<v-text-field
								label="Name Override"
								placeholder="Optional. Provide only if you want NPC to have a specific name."
								:readonly="!allowEdit"
								v-model="requirement.combat.nameOverride"
								variant="solo"
							></v-text-field>
						</v-col>
					</v-row>
				</template>

				<!--TODO
				- End battle at X HP. Show warning boxes if 0, if the player might die 
				- Allow checkbox to force player death
				- Allow boosting Armor Class or Attack Bonus (Text for reason, number for value. For both player or NPC)
				
				-->
				<template v-if="npcMode == 'inline'">
					<v-row>
						<v-col> Inline NPC Creation coming soon. </v-col>
					</v-row>
				</template>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
	import { IItem, ILocation } from "@/types/SwrpgTypes";
	import type { IEventBase, IEventCondition, IEventSubCondition, IEventRequirement } from "@/types/SwrpgTypes/IEventBase";
	import { computed, reactive, ref, Ref } from "vue";
	import { supportedSpecies, supportedAttributes, supportedSkills } from "@/types/SwrpgTypes/FixedData";
	import { ConditionTranslator } from "@/services/ConditionHelper";

	const props = defineProps<{
		allowEdit: boolean;
		requirement: IEventRequirement;
		removeCombat(): void;
	}>();

	const npcMode: Ref<string> = ref("lookup");

	// const availableItems = computed(() => {
	// 	return props.items.map((e) => {
	// 		return { value: e._id, title: e.name };
	// 	});
	// });

	// const availableLocations = computed(() => {
	// 	return props.locations.map((e) => {
	// 		return { value: e._id, title: e.name };
	// 	});
	// });
</script>
