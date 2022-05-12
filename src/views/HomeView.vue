<template>
	<v-parallax src="https://c.wallhere.com/photos/52/63/Star_Wars_Rogue_One_A_Star_Wars_Story_Death_Star_space-1398041.jpg!d" height="600">
		<div class="d-flex flex-column fill-height justify-center align-center text-white">
			<h1 class="white--text mb-2 display-1 text-center">Star Wars: Galaxy in Turmoil</h1>
			<div class="subheading mb-4 text-center">A custom discord bot based RPG, created by Bejasc</div>
			<!-- <v-btn class="mt-12" color="primary" href="https://discord.gg/MU4XUVS">Join the fight</v-btn> -->
			<v-btn class="mt-6" variant="outlined" :to="{ name: 'Contributor Tools' }" large>Contributor Tools</v-btn>
		</div>
	</v-parallax>
	<section id="features">
		<v-container class="text-center">
			<h2 class="headline">Features</h2>
		</v-container>
		<v-layout align-center>
			<v-layout wrap align-center>
				<v-card class="transparent">
					<v-card-text class="text-center">
						<v-icon x-large color="primary">mdi-account</v-icon>
					</v-card-text>
					<v-card-title primary-title class="layout justify-center">
						<div class="headline text-center">Create a Character</div>
					</v-card-title>
					<v-card-text>
						Upon joining a Galaxy in Turmoil, you'll have the ability to create a unique character from one of many races. The character will stay associated to your
						discord account, event after you leave
					</v-card-text>
				</v-card>
				<v-card flat class="transparent">
					<v-card-text class="text-center">
						<v-icon x-large color="primary">mdi-sword-cross</v-icon>
					</v-card-text>
					<v-card-title primary-title class="layout justify-center">
						<div class="headline">Fight for Control</div>
					</v-card-title>
					<v-card-text>
						Participate in timed and interactive battles across a wide range of well known Star Wars planets and locations. Carve out a name for yourself and climb the
						ranks of either the Rebel Alliance or the Galactic Empire
					</v-card-text>
				</v-card>
				<v-card flat class="transparent">
					<v-card-text class="text-center">
						<v-icon x-large color="primary">mdi-circle-multiple</v-icon>
					</v-card-text>
					<v-card-title primary-title class="layout justify-center">
						<div class="headline text-center">Earn your Credits</div>
					</v-card-title>
					<v-card-text>
						If fighting isn't your thing - there's always credits to be made when there's a war about. Ladden your ship with precious cargo, and find a proffitable
						destination to offload for some handy credits
					</v-card-text>
				</v-card>
			</v-layout>
		</v-layout>
	</section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components

export default defineComponent({
	name: "HomeView",
});
</script>
