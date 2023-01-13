<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel v-for="(condition, index) in props.event.requirements.conditions">
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					{{ condition.identifier }}
					<v-spacer />
					<div class="mx-6">
						<v-btn color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeCondition(condition)"> </v-btn>
					</div>
				</template>
			</v-expansion-panel-title>
			<v-expansion-panel-text>
				<v-row no-gutters>
					<v-col cols="6">
						<v-text-field label="Identifier" :readonly="!allowEdit" v-model="condition.identifier" variant="solo"></v-text-field>
					</v-col>

					<v-col cols="6">
						<v-select v-if="condition.match" label="Match Strategy" :items="matchStrategies" v-model="condition.match" variant="solo"></v-select>
					</v-col>
				</v-row>

				<template v-for="subCondition in condition.subConditions">
					<v-row no-gutters>
						<v-col cols="2">
							<v-select
								label="Type"
								:items="supportedRequirements"
								@update:model-value="resetSubCondition(subCondition)"
								v-model="subCondition.type"
								item-title="title"
								item-value="value"
								variant="solo"
							></v-select>
						</v-col>

						<template v-if="subCondition.type === 'item'">
							<v-col cols="4">
								<v-autocomplete
									label="Item"
									:items="availableItems"
									v-model="subCondition.key"
									item-title="title"
									item-value="value"
									variant="solo"
									v-bind:readonly="!allowEdit"
								></v-autocomplete>
							</v-col>
							<v-col cols="3">
								<v-select
									label="Operator"
									:items="quantityOperators"
									v-model="subCondition.operator"
									item-title="title"
									item-value="value"
									variant="solo"
									v-bind:readonly="!allowEdit"
								></v-select>
							</v-col>
							<v-col cols="2">
								<v-text-field v-model="subCondition.value" v-bind:readonly="!allowEdit" type="number" label="Quantity" variant="solo"></v-text-field>
							</v-col>
						</template>

						<template v-if="subCondition.type === 'location'">
							<v-col cols="3">
								<v-select
									label="Operator"
									:items="exactOperators"
									v-model="subCondition.operator"
									item-title="title"
									item-value="value"
									variant="solo"
									v-bind:readonly="!allowEdit"
								></v-select>
							</v-col>
							<v-col cols="4">
								<v-autocomplete
									label="Location"
									:items="availableLocations"
									v-model="subCondition.key"
									item-title="title"
									item-value="value"
									variant="solo"
								></v-autocomplete>
							</v-col>
						</template>

						<v-spacer></v-spacer>
						<v-col cols="1">
							<v-btn color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeSubCondition(condition, subCondition)"> </v-btn>
						</v-col>
					</v-row>
				</template>

				<div class="text-center mt-5">
					<v-btn class="ma-2" icon="mdi-plus" size="small" variant="outlined" color="green" @click="addSubCondition(condition)"> </v-btn>
				</div>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { IItem, ILocation } from "@/types/SwrpgTypes";
import type { IEventBase, IEventCondition, IEventSubCondition } from "@/types/SwrpgTypes/IEventBase";
import { computed, reactive, watch } from "vue";

const props = defineProps<{
	allowEdit: boolean;
	event: IEventBase;
	items: IItem[];
	locations: ILocation[];
	removeCondition(condition: IEventCondition): void;
}>();

const matchStrategies = ["All of", "Any of", "None of"];

const quantityResults = ["credits", "item", "skill", "hitpoints"];
const quantityOperators = [
	{ title: "Greater or Equal", value: ">=" },
	{ title: "Less than", value: "<" },
];

const exactResults = ["species", "location"];
const exactOperators = [
	{ title: "is", value: "==" },
	{ title: "is not", value: "!=" },
];

const supportedRequirements = [
	// { title: "Credits", value: "credits" },
	{ title: "Item", value: "item" },
	{ title: "Location", value: "location" },
	// { title: "Species", value: "species" },
	// { title: "Skill", value: "skill" },
];

function addSubCondition(condition: IEventCondition) {
	if (!condition.subConditions) {
		condition.subConditions = [];
	}

	const newSubCondition: IEventSubCondition = {
		operator: ">=",
		type: "item",
		key: null,
		value: 1,
	};

	condition.subConditions.push(newSubCondition);
}

function removeSubCondition(condition: IEventCondition, subCondition: IEventSubCondition) {
	condition.subConditions = condition.subConditions.filter((e) => e != subCondition);
	if (condition.subConditions.length == 0) delete condition.subConditions;
}

function resetSubCondition(subCondition: IEventSubCondition) {
	subCondition.key = null;
	subCondition.operator = null;
	subCondition.value = null;
}

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
	() => props.event.requirements,
	(newVal, oldVal) => {
		setHelper();
	},
);
</script>
