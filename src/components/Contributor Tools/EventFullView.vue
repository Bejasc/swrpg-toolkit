<template>
	<v-row justify="center">
		<v-dialog v-model="show" persistent width="1200">
			<v-card width="1200px" max-height="800px" :title="eventData.embedOptions.title">
				<v-card-text style="max-height: 80vh" class="mx-3 overflow-y-auto"> </v-card-text>
				<EventEditor :allow-edit="allowEdit" :event-data="eventData" :is-top-level="true" :all-items="items"></EventEditor>
				<v-card-actions>
					<small style="opacity: 0.2">Event ID: {{ eventData.id }}</small>

					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="$emit('closeFullView')"> Close </v-btn>
					<v-btn v-if="allowEdit" color="green darken-1" :disabled="!eventData.embedOptions.title" text @click="saveEvent()"> Save </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
	<DrpgLoader :showLoader="showLoader" />
</template>

<style scoped>
.itemThumbnail {
	object-fit: contain;
	object-position: center;
	margin: 0 auto;
}

a {
	color: red;
	text-decoration: underline;
	font-style: normal;
	font-weight: bold;
}
</style>

<script lang="ts">
import EventEditor from "@/components/Contributor Tools/EventEditor.vue";
import DiscordEmbed from "@/components/Discord/DiscordEmbed.vue";
import DrpgLoader from "@/components/DrpgLoader.vue";
import { getData } from "@/plugins/MongoConnector";
import type { IEventBase } from "@/types/SwrpgTypes/IEventBase";
import type IItem from "@/types/SwrpgTypes/IItem";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "EventFullView",
	components: { DiscordEmbed, EventEditor, DrpgLoader },
	props: {
		show: Boolean,
		eventData: {
			type: Object as PropType<IEventBase>,
			required: true,
		},
		allowEdit: Boolean,
	},
	data: () => {
		return {
			showLoader: false,
			items: [] as IItem[],
		};
	},
	methods: {
		async saveEvent() {
			(this.$parent as any).showLoader = true;

			this.$emit("eventSaved", this.eventData);
			(this.$parent as any).showLoader = false;
		},
		async loadAllItems() {
			this.showLoader = true;
			this.items = [];
			this.items = await getData<IItem>("item", null, "v2");

			console.table(this.items);
			this.showLoader = false;
		},
	},
	mounted() {
		this.loadAllItems();
	},
});
</script>
