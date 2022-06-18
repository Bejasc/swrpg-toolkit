<template>
	<div class="text-h6">{{ $route.name }}</div>
	<v-breadcrumbs :items="breadCrumbs"></v-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export interface IBreadcrumbData {
	text: string;
	disabled: boolean;
	to: { name: string };
	exact: boolean;
}
export default defineComponent({
	name: "Breadcrumb",
	emits: ["pageNavigation"],
	data: () => {
		return {
			breadCrumbs: [] as IBreadcrumbData[],
		};
	},
	watch: {
		$route(to, from) {
			this.updateBreadcrumb(to.name, to.name);
		},
	},
	methods: {
		updateBreadcrumb(text: string = "Link", to: string = "#") {
			const breadcrumbData = { text, to: { name: to }, disabled: false, exact: true };

			const existingIndex = this.breadCrumbs.indexOf(breadcrumbData);
			console.log(existingIndex);
			//TODO If already in stack, trim stack to that
			//Below doens't work
			if (existingIndex == -1) this.breadCrumbs.push(breadcrumbData);
			else {
				console.log(`${text} existed in array already. Breadcrumbs were truncated`);
				this.breadCrumbs.length = existingIndex + 1;
			}
		},
	},
	// computed: {
	// 	breadcrumbs() {
	// 		const x = this.$router.getRoutes();
	// 		x.map((e) => console.log("aa", e));

	// 		//TODO on router event on before route, push next target into it. When going backwards, see if that route already exists in the stack, if so, remove all after it.
	// 		const data: BreadcrumbData[] = [{ text: "Contributor Tools", disabled: false, to: { name: "Contributor Tools" }, exact: true }];
	// 		return data;
	// 	},
	// },
});
</script>
