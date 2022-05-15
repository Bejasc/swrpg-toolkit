<template>
	<ContributorSidebar />
	<v-main>
		<v-container fluid>
			<Breadcrumb />
			<!-- If using vue-router -->
			<router-view class="ma-4" />
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import ContributorSidebar from "../../components/Contributor Tools/ContributorSidebar.vue";

// Components

export default defineComponent({
	name: "ContributorDirectory",
	components: { ContributorSidebar, Breadcrumb },
});
</script>
