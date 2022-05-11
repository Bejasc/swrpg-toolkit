<template>
	<v-parallax src="https://www.teahub.io/photos/full/106-1064285_2560x1080-millennium-falcon-star-wars-battlefront-millenium-falcon.jpg" height="600">
		<div class="d-flex flex-column fill-height justify-center align-center text-white">
			<h1 class="white--text mb-2 display-1 text-center">Star Wars: Galaxy in Turmoil</h1>
			<div class="subheading mb-4 text-center">A discord based RPG powered by bots, created by Bejasc</div>
			<v-btn class="mt-12" color="primary" dark large href="https://discord.gg/MU4XUVS">Join the fight</v-btn>
			<!-- <v-btn class="mt-6" outlined large :to="{ name: 'Tools' }">View Tools</v-btn> -->
		</div>
	</v-parallax>
	hello
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components

export default defineComponent({
	name: "HomeView",
});
</script>
