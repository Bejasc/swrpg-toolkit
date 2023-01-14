<template>
	<v-row no-gutters>
		<v-btn class="my-5" color="red" variant="plain" icon="mdi-delete-outline" size="small" @click.stop="removeResult(eventResult)"> </v-btn>
		<v-col cols="2">
			<v-select label="Modifier" :items="supportedModifiers" v-model="eventResult.modifier" item-title="title" item-value="value" variant="solo"></v-select>
		</v-col>
		<v-col cols="2">
			<v-select label="Target" :items="supportedTypes" v-model="eventResult.type" item-title="title" item-value="value" variant="solo"></v-select>
		</v-col>
		<template v-if="['credits', 'item', 'experience'].includes(eventResult.type)">
			<v-col cols="2">
				<v-text-field :label="eventResult.modifier == 'set' ? 'Value' : 'Quantity'" variant="solo" type="number" v-model="eventResult.value"></v-text-field>
			</v-col>
		</template>
		<template v-if="eventResult.type == 'item'">
			<v-col>
				<v-autocomplete label="Item" :items="availableItems" v-model="eventResult.key" item-title="title" item-value="value" variant="solo"></v-autocomplete>
			</v-col>
		</template>
	</v-row>
</template>

<script lang="ts">
import { IItem } from "@/types/SwrpgTypes";
import type { IEventResult } from "@/types/SwrpgTypes/IEventBase";
import { defineComponent, type PropType } from "vue";
export default defineComponent({
	name: "EventResult",

	props: {
		eventResult: {
			type: Object as PropType<IEventResult>,
			required: true,
		},
		allowEdit: Boolean,
		removeResult: {
			type: Function,
			required: true,
		},
		allItems: {
			type: Object as PropType<IItem[]>,
			required: true,
		},
	},
	data: () => {
		return {
			supportedModifiers: [
				{ value: "add", title: "Add" },
				{ value: "remove", title: "Remove" },
				{ value: "set", title: "Set" },
			],
		};
	},
	methods: {},
	computed: {
		valueText(selected: string): string {
			return "Count";
		},
		availableItems(): { value: string; title: string }[] {
			return this.allItems.map((e) => {
				return { value: e._id, title: e.name };
			});
		},
		supportedTypes(): { value: string; title: string }[] {
			return [
				{ value: "credits", title: "Credits" },
				{ value: "item", title: "Items" },
				{ value: "experience", title: "Experience" },
			];
		},
	},
});
</script>
