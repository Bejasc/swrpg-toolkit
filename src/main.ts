import EventEditor from "@/components/Contributor Tools/Events/EventEditor.vue";
import EventLink from "@/components/Contributor Tools/Events/EventLink.vue";
import { createApp } from "vue";
import VueGtag from "vue-gtag";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
import { stateStore } from "./stores/MainState";

loadFonts();

const app = createApp(App);
app.use(router)
	.use(vuetify)
	.use(stateStore)
	.use(VueGtag, { config: { id: "G-N7NC3E9LTN" } }, router)
	.mount("#app");
stateStore.commit("setShowLoader", false);
app.component("EventLinkComponent", EventLink);
app.component("EventEditorComponent", EventEditor);
