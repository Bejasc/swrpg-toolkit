import { createApp } from "vue";
import App from "./App.vue";
import EventEditor from "./components/Contributor Tools/EventEditor.vue";
import EventLink from "./components/Contributor Tools/EventLink.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";

loadFonts();

const app = createApp(App);
app.use(router).use(vuetify).mount("#app");

app.component("EventLinkComponent", EventLink);
app.component("EventEditorComponent", EventEditor);
