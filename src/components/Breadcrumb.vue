<template>
	<div class="text-h6">{{ $route.name }}</div>
	<v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface BreadcrumbData {
	text: string;
	disabled: boolean;
	to: { name: string };
	exact: boolean;
}

export default defineComponent({
	name: "Breadcrumb",
	computed: {
		breadcrumbs() {
			const x = this.$router.getRoutes();
			x.map((e) => console.log("aa", e));

			//TODO on router event on before route, push next target into it. When going backwards, see if that route already exists in the stack, if so, remove all after it.
			const data: BreadcrumbData[] = [{ text: "Contributor Tools", disabled: false, to: { name: "Contributor Tools" }, exact: true }];
			return data;
		},
	},
});
</script>
