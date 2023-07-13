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
		<TreeItem class="item" :model="eventNodes" :level="1"></TreeItem>
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
