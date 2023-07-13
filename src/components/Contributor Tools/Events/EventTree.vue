<!-- <template>
	<Tree v-model:nodes="data" />
</template>

<script setup lang="ts">
	import { IEventBase, IEventLink } from "@/types/SwrpgTypes/IEventBase";
	import { computed, PropType, ref } from "vue";
	import Tree from "vue3-tree";

	const props = defineProps({
		baseEvent: {
			type: Object as PropType<IEventBase>,
			required: true,
		},
	});

	type NodeMap = {
		id: string;
		label: string;
		nodes?: NodeMap[];
	};

	const data = ref([
		{
			id: 1,
			label: "Animal",
			nodes: [
				{
					id: 2,
					label: "Dog",
				},
				{
					id: 3,
					label: "Cat",
					nodes: [
						{
							id: 4,
							label: "Egyptian Mau Cat",
						},
						{
							id: 5,
							label: "Japanese Bobtail Cat",
						},
					],
				},
			],
		},
		{
			id: 6,
			label: "People",
		},
	]);

	const eventNodes = computed(() => {
		props.baseEvent;

		const m: NodeMap = {
			id: props.baseEvent.id,
			label: `${props.baseEvent.embedOptions?.title ?? "Untitled"}`,
		};

		if (props.baseEvent.eventLinks?.length > 0) {
			m.nodes = getNodes(props.baseEvent);
		}

		return [m];
	});

	function getNodes(event: IEventBase): NodeMap[] {
		return event.eventLinks.flatMap((e) => {
			return e.event.map((x) => {
				return {
					id: x.id,
					label: `${e.title ?? "Option"} > ${x.embedOptions?.title ?? "Untitled"}`,
					nodes: x.eventLinks?.length > 0 ? getNodes(x) : [],
				};
			});
		});
	}
</script> -->

<!--
A nested tree component that recursively renders itself.
You can double click on an item to turn it into a folder.
-->

<script setup lang="ts">
	import { IEventBase, IEventLink } from "@/types/SwrpgTypes/IEventBase";
	import { computed, PropType, ref } from "vue";
	import TreeItem from "./TreeItem.vue";

	const props = defineProps({
		baseEvent: {
			type: Object as PropType<IEventBase>,
			required: true,
		},
	});

	type NodeMap = {
		id: string;
		name: string;
		children?: NodeMap[];
	};

	const eventNodes = computed(() => {
		props.baseEvent;

		const m: NodeMap = {
			id: props.baseEvent.id,
			name: `${props.baseEvent.embedOptions?.title ?? "Untitled"}`,
			children: [],
		};

		if (props.baseEvent.eventLinks?.length > 0) {
			m.children = getNodes(props.baseEvent);
		}

		return m;
	});

	function getNodes(event: IEventBase): NodeMap[] {
		return event.eventLinks.flatMap((e) => {
			return e.event.map((x) => {
				return {
					id: x.id,
					name: `${e.title ?? "Option"} > ${x.embedOptions?.title ?? "Untitled"}`,
					children: x.eventLinks?.length > 0 ? getNodes(x) : [],
				};
			});
		});
	}
</script>

<template>
	<ul>
		<TreeItem class="item" :model="eventNodes"></TreeItem>
	</ul>
</template>

<style>
	.item {
		cursor: pointer;
		line-height: 1.5;
	}
	.bold {
		font-weight: bold;
	}
</style>
