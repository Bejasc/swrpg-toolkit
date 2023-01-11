<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel>
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					{{ helpers.conditionKey }}
					<v-spacer />
					<div class="mx-6">
						<!-- <v-btn color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeSubcondition(props.condition)"> </v-btn> -->
					</div>
				</template>
			</v-expansion-panel-title>

			<v-expansion-panel-text>
				<v-row no-gutters>
					<v-btn class="ma-3" variant="outlined" color="blue" outline @click="addSubCondition()"> Add Sub-condition </v-btn>
				</v-row>

				<v-expansion-panels variant="accordion">
					<v-expansion-panel v-for="(condition, index) in props.requirement.conditions">
						<v-expansion-panel-title color="blue-darken-3">
							<template v-slot:default="{ expanded }">
								{{ `Requirement ${index + 1}` }}
								<v-spacer />
								<div class="mx-6">
									<v-btn color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeSubcondition(condition)"> </v-btn>
								</div>
							</template>
						</v-expansion-panel-title>
					</v-expansion-panel>
				</v-expansion-panels>

				<div class="text-center my-5"></div>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { IItem, ILocation } from "@/types/SwrpgTypes";
import type { IEventRequirement, IEventCondition } from "@/types/SwrpgTypes/IEventBase";
import { computed, reactive, watch } from "vue";

const props = defineProps<{
	allowEdit: boolean;
	requirement: IEventRequirement;
	items: IItem[];
	locations: ILocation[];
	removeSubcondition(condition: IEventCondition): void;
}>();

const matchStrategies = ["All of", "One of", "None of"];

const quantifiedResults = ["credits", "item", "skill", "hitpoints"];
const quantifiedMatch = [
	{ title: "Greater or Equal", value: ">=" },
	{ title: "Less than", value: "<" },
];

const exactResults = ["species", "location"];
const exactMatch = [
	{ title: "is", value: "==" },
	{ title: "is not", value: "!=" },
];

const supportedRequirements = [
	{ title: "Credits", value: "credits" },
	{ title: "Item", value: "item" },
	{ title: "Location", value: "location" },
	{ title: "Species", value: "species" },
	{ title: "Skill", value: "skill" },
];

const availableItems = computed(() => {
	return props.items.map((e) => {
		return { value: e._id, title: e.name };
	});
});

const availableLocations = computed(() => {
	return props.locations.map((e) => {
		return { value: e._id, title: e.name };
	});
});

function addSubCondition() {
	if (!props.requirement.conditions) props.requirement.conditions = [];
	const newCondition: IEventCondition = {
		match: "All of",
		type: "item",
		values: [],
	};
	props.requirement.conditions.push(newCondition);
}

function removeSubcondition(condition: IEventCondition) {
	props.requirement.conditions = props.requirement.conditions.filter((e) => e != condition);
	if (props.requirement.conditions.length === 0) delete props.requirement.conditions;
}

interface IHelpers {
	conditionKey: string;
}

const initialState: IHelpers = {
	conditionKey: "New Condition",
};

const helpers = reactive({ ...initialState });

function setHelper() {
	const newState: IHelpers = initialState;

	Object.assign(helpers, JSON.parse(JSON.stringify(newState)));
}

watch(
	() => props.requirement,
	(newVal, oldVal) => {
		setHelper();
	},
);
</script>
