<template>
	<v-app>
		<TopBar />
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopBar from "./components/TopBar.vue";

export default defineComponent({
	name: "App",
	components: { TopBar },

	data() {
		return {
			//
		};
	},
	computed: {
		theme() {
			return this.$vuetify.theme.getTheme("dark") ? "dark" : "light";
		},
	},
});
</script>
