<template>
	<v-main>
		<v-container>
			<v-btn @click="login">Log in</v-btn>
		</v-container>
	</v-main>
</template>
<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
	setup() {
		const { loginWithRedirect } = useAuth0();

		return {
			login: () => {
				loginWithRedirect();
			},
		};
	},
};
</script>
