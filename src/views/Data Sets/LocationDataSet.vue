<template>
	<v-col cols="11">
		<v-card> test </v-card>
	</v-col>
	<DrpgLoader :showLoader="true" />
</template>

<style scoped>
.imageMouseover {
	filter: brightness(100%) blur(0.5px);
	-webkit-transition: -webkit-filter 200ms linear;
}
.imageMouseover:hover {
	cursor: pointer;

	filter: brightness(115%) blur(0px);
	-webkit-transition: -webkit-filter 200ms linear;
}
</style>

<script lang="ts">
import DrpgLoader from "@/components/DrpgLoader.vue";
import { defineComponent } from "vue";
// Components
export default defineComponent({
	name: "LocationDataSet",
	components: { DrpgLoader },
	data: () => {
		return {};
	},
});
</script>
