import EventEditor from "@/components/Contributor Tools/Events/EventEditor.vue";
import EventLink from "@/components/Contributor Tools/Events/EventLink.vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";

loadFonts();

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(vuetify);

// app.use(stateStore);
app.use(pinia);
app.mount("#app");

app.component("EventLinkComponent", EventLink);
app.component("EventEditorComponent", EventEditor);
