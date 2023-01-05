<template>
	<v-main>
		<v-container>
			<v-btn @click="logout">Log out</v-btn>
		</v-container>
	</v-main>
</template>
<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
	setup() {
		const { logout } = useAuth0();

		return {
			logout: () => {
				logout({ returnTo: window.location.origin });
			},
		};
	},
};
</script>
