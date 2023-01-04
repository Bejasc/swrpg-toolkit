<template>
	<v-expansion-panels variant="accordion">
		<v-expansion-panel :title="eventLink.title ?? 'Unnamed Option'">
			<v-expansion-panel-text>
				<v-row no-gutters>
					<v-col cols="4">
						<v-text-field label="Button Label" :readonly="!allowEdit" v-model="eventLink.title" density="compact" placeholder="Pickup" required></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field
							label="Short Description"
							:readonly="!allowEdit"
							v-model="eventLink.description"
							density="compact"
							placeholder="Pickup the credits"
							required
						></v-text-field>
					</v-col>
				</v-row>

				<div class="text-center my-5">
					<v-btn variant="outlined" color="red" outline>
						<v-icon icon="mdi-delete-outline" /> Remove {{ eventLink.title }} Option

						<v-dialog class="myDialog" v-model="dialogConfirmDeleteLink" activator="parent" transition="fade-transition" persistent>
							<v-card>
								<v-card-text> Are you sure you want to remove this event link? <br />This cannot be undone </v-card-text>
								<v-card-actions>
									<v-spacer />
									<v-btn color="blue" @click="dialogConfirmDeleteLink = false">Cancel</v-btn>
									<v-btn color="red" @click="removeEventLink()">Remove</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-btn>
				</div>
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
import type { IEventLink } from "@/types/SwrpgTypes/IEventBase";
import { defineComponent, type PropType } from "vue";
export default defineComponent({
	name: "EventLink",
	props: {
		show: Boolean,
		eventLink: {
			type: Object as PropType<IEventLink>,
			required: true,
		},
		allowEdit: Boolean,
	},
	data: () => {
		return {
			dialogConfirmDeleteLink: false,
		};
	},
	methods: {
		removeEventLink() {
			//TODO emit
			//this.eventData.eventLinks.splice(index, 1);
			this.dialogConfirmDeleteLink = false;
			this.$emit("eventLinkDeleted", this.eventLink);
		},
	},
});
</script>
