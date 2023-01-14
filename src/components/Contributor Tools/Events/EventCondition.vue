<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel v-for="(condition, index) in props.event.requirements.conditions">
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					{{ condition.identifier }}
					<v-spacer />
					<v-btn class="mx-3" color="blue" variant="outlined" icon="mdi-help" size="small" @click.stop="showDebugCondition(condition)"> </v-btn>

					<v-btn class="mx-3" color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeCondition(condition)"> </v-btn>
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

						<template v-if="subCondition.type === 'skill'">
							<v-col cols="4">
								<v-autocomplete
									label="Skill"
									:items="supportedSkills"
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
								<v-text-field v-model="subCondition.value" v-bind:readonly="!allowEdit" type="number" label="Level" variant="solo"></v-text-field>
							</v-col>
						</template>

						<template v-if="subCondition.type === 'attribute'">
							<v-col cols="4">
								<v-autocomplete
									label="Item"
									:items="supportedAttributes"
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
								<v-text-field v-model="subCondition.value" v-bind:readonly="!allowEdit" type="number" label="Level" variant="solo"></v-text-field>
							</v-col>
						</template>

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

						<template v-if="subCondition.type === 'credits'">
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
								<v-text-field v-model="subCondition.value" v-bind:readonly="!allowEdit" type="number" label="Credits" variant="solo"></v-text-field>
							</v-col>
						</template>

						<template v-if="subCondition.type === 'hitpoints'">
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
								<v-text-field v-model="subCondition.value" v-bind:readonly="!allowEdit" type="number" label="Hitpoints" variant="solo"></v-text-field>
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

						<template v-if="subCondition.type === 'species'">
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
									label="Species"
									:items="supportedSpecies"
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

	<v-dialog v-model="showConditionDebug" max-width="290">
		<v-card width="500">
			<v-card-title>{{ conditionDebugObject.title }}</v-card-title>
			<v-card-subtitle> {{ conditionDebugObject.main }} </v-card-subtitle>

			<v-card-text>
				<v-list-item v-for="(condition, index) in conditionDebugObject.subconditions" :key="index">
					<v-list-item-title>
						<strong>
							{{ condition }}
						</strong>
						<br />
						<template v-if="conditionDebugObject.subconditions.length > 1 && index != conditionDebugObject.subconditions.length - 1">
							{{ conditionDebugObject.separator }}
						</template>
					</v-list-item-title>
				</v-list-item>
			</v-card-text>

			<v-card-actions>
				<v-btn text @click="showConditionDebug = false"> Okay </v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { IItem, ILocation } from "@/types/SwrpgTypes";
import type { IEventBase, IEventCondition, IEventSubCondition } from "@/types/SwrpgTypes/IEventBase";
import { computed, reactive, ref, Ref } from "vue";
import { supportedSpecies, supportedAttributes, supportedSkills } from "@/types/SwrpgTypes/FixedData";
import { ConditionTranslator } from "@/services/ConditionHelper";

const props = defineProps<{
	allowEdit: boolean;
	event: IEventBase;
	items: IItem[];
	locations: ILocation[];
	removeCondition(condition: IEventCondition): void;
}>();

const matchStrategies = ["All of", "Any of", "None of"];

const quantityOperators = [
	{ title: "Greater or Equal", value: ">=" },
	{ title: "Less than", value: "<" },
];

const exactOperators = [
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

interface IConditionDebug {
	title: string;
	main: string;
	subconditions: string[];
	separator: string;
}

const showConditionDebug = ref(false);
let conditionDebugObject: IConditionDebug = reactive({
	title: null,
	main: null,
	subconditions: [],
	separator: "and",
});

function showDebugCondition(condition: IEventCondition) {
	const dbg = ConditionTranslator.explainCondition(condition, props.items, props.locations);

	conditionDebugObject.main = dbg.main;
	conditionDebugObject.title = condition.identifier;
	conditionDebugObject.subconditions = dbg.subConditions;
	conditionDebugObject.separator = condition.match == "All of" ? "and" : "or";
	showConditionDebug.value = true;
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
</script>
