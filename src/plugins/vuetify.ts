// Styles
import "@mdi/font/css/materialdesignicons.css";
// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";

const swrpgTheme = {
	dark: true,
	colors: {
		primary: "#7289DA",
		secondary: "#4E5D94",
		accent: "#FFFFFF",
		background: "#23272A",
	},
};

export default createVuetify({
	// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
	theme: {
		defaultTheme: "swrpgTheme",
		themes: {
			swrpgTheme,
		},
	},
});
