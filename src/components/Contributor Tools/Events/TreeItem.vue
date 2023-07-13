<script setup>
	import { ref, computed } from "vue";

	const props = defineProps({
		model: Object,
		level: Number,
	});

	const isOpen = ref(false);
	const isFolder = computed(() => {
		return props.model.children && props.model.children.length;
	});

	function toggle() {
		isOpen.value = !isOpen.value;
	}

	const indent = computed(() => {
		return props.level * 15;
	});
</script>

<template>
	<li>
		<div :class="{ bold: isFolder }" @click="toggle">
			{{ model.name }}
			<span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
		</div>
		<ul v-show="isOpen" v-if="isFolder" v-bind:style="{ 'margin-left': indent + 'px' }">
			<TreeItem class="item" v-for="model in model.children" :model="model" :level="props.level + 1"> </TreeItem>
		</ul>
	</li>
</template>
