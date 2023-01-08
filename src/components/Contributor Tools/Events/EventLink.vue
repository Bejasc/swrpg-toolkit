<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel>
			<v-expansion-panel-title>
				<template v-slot:default="{ expanded }">
					{{ eventLink.title ?? "Unnamed Option" }}
					<v-spacer />
					<div class="mx-6">
						<v-btn color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeEventLink(eventLink)"> </v-btn>
					</div>
				</template>
			</v-expansion-panel-title>

			<v-expansion-panel-text>
				<v-row no-gutters>
					<v-col cols="4" class="ma-2">
						<v-text-field label="Button Label" :readonly="!allowEdit" v-model="eventLink.title" density="compact" placeholder="Pickup" required></v-text-field>
					</v-col>
					<v-col cols="5" class="ma-2">
						<v-text-field
							label="Short Description"
							:readonly="!allowEdit"
							v-model="eventLink.description"
							density="compact"
							placeholder="Pickup the credits"
							required
						></v-text-field>
					</v-col>
					<v-spacer />
					<v-btn class="ma-3" variant="outlined" color="blue" outline @click="addEvent()"> Add Result </v-btn>
				</v-row>

				<v-expansion-panels variant="accordion">
					<v-expansion-panel v-for="(event, index) in eventLink.event">
						<v-expansion-panel-title color="blue-darken-3">
							<template v-slot:default="{ expanded }">
								{{ event.embedOptions.title ?? `Result ${index + 1}` }}
								<v-spacer />
								<div class="mx-6">
									<v-btn color="red" variant="outlined" icon="mdi-delete-outline" size="small" @click.stop="removeEventFromLink(event)"> </v-btn>
								</div>
							</template>
						</v-expansion-panel-title>

						<v-expansion-panel-text>
							<EventEditorComponent :eventData="event" :allowEdit="allowEdit" :allItems="allItems"></EventEditorComponent>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>

				<div class="text-center my-5"></div>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<style scoped>
.myDialog {
	position: absolute;
	margin: 0 auto !important;
	width: 400px;
}
</style>

<script lang="ts">
import { IItem } from "@/types/SwrpgTypes";
import { DEFAULT_EVENT_STATE, IEventBase, IEventLink } from "@/types/SwrpgTypes/IEventBase";
import { defineComponent, type PropType } from "vue";
export default defineComponent({
	name: "EventLink",
	components: {
		EventEditor: () => import("@/components/Contributor Tools/Events/EventEditor.vue"),
	},
	props: {
		// rootEvent: {
		// 	type: Object as PropType<IEventBase>,
		// 	required: true,
		// },
		eventLink: {
			type: Object as PropType<IEventLink>,
			required: true,
		},
		allowEdit: Boolean,
		removeEventLink: {
			type: Function,
			required: true,
		},
		allItems: {
			type: Object as PropType<IItem[]>,
			required: true,
		},
	},
	data: () => {
		return {
			dialogConfirmDeleteLink: false,
		};
	},
	methods: {
		addEvent() {
			const newEvent: IEventBase = JSON.parse(JSON.stringify(DEFAULT_EVENT_STATE));
			this.eventLink.event.push(newEvent);
		},
		removeEventFromLink(event: IEventBase) {
			this.eventLink.event = this.eventLink.event.filter((e) => e != event);
		},
	},
});
</script>
