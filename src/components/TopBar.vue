<template>
	<v-app-bar app permanent color="background">
		<v-toolbar-title>SWRPG - {{ $route.name }}</v-toolbar-title>
		<v-spacer />
		<!-- <v-btn outlined>View docs</v-btn> -->
		<v-menu anchor="start">
			<template v-slot:activator="{ props }">
				<v-btn color="primary" v-bind="props">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>
			<v-list>
				<v-list-item v-for="item in items" :key="item.text" link active-class="big" @click="item.click()">
					<v-list-item-avatar start>
						<v-icon :icon="item.icon"></v-icon>
					</v-list-item-avatar>
					<v-list-item-title>{{ item.text }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<!-- <v-menu transition="slide-x-transition" bottom right>
			<template v-slot:activator="{ on, attrs }">
				<v-btn class="deep-orange" color="primary" dark v-bind="attrs" v-on="on"> Slide X Transition </v-btn>
			</template>
			<template v-slot:activator="{ props }">
				<v-btn icon v-bind="props">
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</template>


		</v-menu> -->
	</v-app-bar>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import router from "@/router";
export default {
	name: "TopBar",
	methods: {
		navigate: function (target: string) {
			window.open(target, "_blank");
		},
	},
	data() {
		return {
			items: [
				{
					text: "Home",
					icon: "mdi-home",
					click: function () {
						router.push({ name: "Home" });
					},
				},
				{
					text: "About",
					icon: "mdi-hammer",
					click: function () {
						router.push({ name: "About" });
					},
				},
				{
					text: "Join",
					icon: "mdi-discord",
					click: function () {
						window.open("https://discord.gg/MU4XUVS", "_blank");
					},
				},
			],
		};
	},
};
</script>
