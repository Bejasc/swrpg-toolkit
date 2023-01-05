import { createAuth0 } from "@auth0/auth0-vue";
import { createApp } from "vue";
import App from "./App.vue";
import EventEditor from "./components/Contributor Tools/EventEditor.vue";
import EventLink from "./components/Contributor Tools/EventLink.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
loadFonts();

const app = createApp(App);
app.use(router)
	.use(vuetify)
	.use(
		createAuth0({
			domain: "drpg.au.auth0.com",
			client_id: "Dq5Mycu6Oq9hwLjTVeBbB24K4ly7mXiR",
			redirect_uri: window.location.origin,
		}),
	)
	.mount("#app");

app.component("EventLinkComponent", EventLink);
app.component("EventEditorComponent", EventEditor);
