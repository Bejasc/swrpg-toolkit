import { defineStore } from "pinia";

export const mainPropertyStore = defineStore("mainPropertyStore", {
	state: () => ({ isLoading: false }),
	actions: {
		async showLoader(newValue: boolean) {
			if (newValue === false) {
				const min = 200;
				const max = 750;
				const randDelay = Math.floor(Math.random() * (max - min + 1) + min);
				console.log(`Artificial delay of ${randDelay}`);
				await new Promise((resolve) => setTimeout(resolve, randDelay));
			}
			this.showLoader = newValue;
		},
	},
});
