<template>
	<v-row no-gutters>
		<v-btn class="my-5" color="red" variant="plain" icon="mdi-delete-outline" size="small" @click.stop="removeCondition(condition)"> </v-btn>
	</v-row>
</template>

<script setup lang="ts">
import { IItem, ILocation } from "@/types/SwrpgTypes";
import type { IEventBase, IEventCondition } from "@/types/SwrpgTypes/IEventBase";
import { reactive, watch } from "vue";

const props = defineProps<{
	allowEdit: boolean;
	condition: IEventCondition;
	removeCondition(condition: IEventCondition): void;
}>();

const matchStrategies = ["All of", "One of", "None of"];
const supportedRequirements = [
	{ title: "Credits", value: "credits" },
	{ title: "Item", value: "itemInInventory" },
];

//TODO get Items and Locations from state

/*
interface IHelpers {
	selectedRequirementType: "species" | "itemInInventory" | "location" | "skill" | "affinity" | "itemEquipped" | "credits";
}

const initialState: IHelpers = {
	selectedRequirementType: "itemInInventory",
};

const helpers = reactive({ ...initialState });

function setHelper() {
	const newState: IHelpers = initialState;

	Object.assign(helpers, JSON.parse(JSON.stringify(newState)));
}

watch(
	() => props.condition,
	(newVal, oldVal) => {
		setHelper();
	},
);
*/
</script>
