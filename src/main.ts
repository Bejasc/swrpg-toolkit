import EventEditor from "@/components/Contributor Tools/Events/EventEditor.vue";
import EventLink from "@/components/Contributor Tools/Events/EventLink.vue";
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";

loadFonts();

const app = createApp(App);
app.use(router).use(vuetify).mount("#app");

app.component("EventLinkComponent", EventLink);
app.component("EventEditorComponent", EventEditor);
