<template>
	<ContributorSidebar />
	<v-main>
		<v-container fluid>
			<!-- If using vue-router -->
			<router-view class="ma-4" />
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContributorSidebar from "../../components/Contributor Tools/ContributorSidebar.vue";

// Components

export default defineComponent({
	name: "ContributorDirectory",
	components: { ContributorSidebar },
});
</script>
