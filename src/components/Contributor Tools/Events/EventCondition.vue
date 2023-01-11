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
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { IItem, ILocation } from "@/types/SwrpgTypes";
import type { IEventBase, IEventCondition } from "@/types/SwrpgTypes/IEventBase";
import { computed, reactive, watch } from "vue";

const props = defineProps<{
	allowEdit: boolean;
	event: IEventBase;
	items: IItem[];
	locations: ILocation[];
	removeCondition(condition: IEventCondition): void;
}>();

const matchStrategies = ["All of", "Any of", "None of"];

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
