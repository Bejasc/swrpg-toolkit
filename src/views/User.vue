<template>
	<v-main>
		<v-container>
			<h2>User Profile</h2>
			<v-btn @click="login">Log in</v-btn>
			<pre v-if="isAuthenticated">
		  		<code>{{ user }}</code>
			</pre>
		</v-container>
	</v-main>
</template>
<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
	setup() {
		const { loginWithRedirect, user, isAuthenticated } = useAuth0();

		return {
			login: () => {
				loginWithRedirect();
			},
			user,
			isAuthenticated,
		};
	},
};
</script>
