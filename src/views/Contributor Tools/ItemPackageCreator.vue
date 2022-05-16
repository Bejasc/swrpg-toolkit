<template>
	<h1>What have we here?</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components

export default defineComponent({
	name: "Item Package Creator",
	emits: ["pageNavigation"],
	data: () => {
		return {};
	},
	mounted() {
		this.$emit("pageNavigation", this.$route.name);
	},
});
</script>
