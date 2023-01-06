import Vuex from "vuex";

export const stateStore = new Vuex.Store({
	state: {
		showLoader: Boolean,
	},
	mutations: {
		async setShowLoader(state, newValue) {
			if (newValue === false) {
				const min = 200;
				const max = 750;
				const randDelay = Math.floor(Math.random() * (max - min + 1) + min);
				console.log(`Artificial delay of ${randDelay}`);
				await new Promise((resolve) => setTimeout(resolve, randDelay));
			}
			state.showLoader = newValue;
		},
	},
	actions: {
		showLoader({ commit }, newValue: boolean) {
			commit("setShowLoader", newValue);
		},
	},
});
