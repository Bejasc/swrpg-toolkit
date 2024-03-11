<template>
	<v-col cols="5">
		<v-card>
			<v-card-title>Hook Builder</v-card-title>
			<v-form class="pa-6 ma-2">
				<v-text-field v-model="hook.title" label="Title" placeholder="Title"></v-text-field>
				<v-textarea v-model="hook.description" label="Description" placeholder="Description"></v-textarea>
				<v-text-field v-model="hook.thumbnail" label="Thumbnail URL (Optional)" placeholder="Image URL"></v-text-field>
				<v-text-field v-model="hook.image" label="Image URL (Optional)" placeholder="Image URL"></v-text-field>

				<v-row justify="space-around">
					<discord-embed color="#121212" :title="hook.title" :thumbnail="hook.thumbnail" :image="hook.image">
						<span v-if="hook.description">
							{{ hook.description }}
						</span>
					</discord-embed>
				</v-row>
				<v-row justify="space-around" class="pa-4">
					<v-btn color="success" dark v-on:click="copyToClipboard()" v-bind:disabled="hook.title.length == 0 || hook.description.length == 0">
						Get Hook Code
					</v-btn>
					<v-btn color="primary" dark v-on:click="clearForm()">
						Clear Form
					</v-btn>
				</v-row>
			</v-form>
			<v-snackbar v-model="snackbar" color="green" timeout="2500"> {{ hook.title }} was copied to clipboard </v-snackbar>
		</v-card>
	</v-col>
</template>

<script lang="ts">
import DiscordEmbed from '@/components/Discord/DiscordEmbed.vue';
import { Hook } from '@/types/Hook';
import { defineComponent } from 'vue';

    export default defineComponent({
	name: "ContentCreation",
    components: { DiscordEmbed },
	methods: {
		copyToClipboard() {
			this.snackbar = true;
			navigator.clipboard.writeText(this.hook.toCommand());
		},
		clearForm() {
			this.hook = new Hook();
		},
	},
	data: () => {
		return {
			hook: new Hook(),
			snackbar: false,
		};
	},
});
</script>
