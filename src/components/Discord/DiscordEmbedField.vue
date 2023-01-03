<template>
	<div :class="{ 'discord-inline-field': inline }" class="discord-embed-field">
		<div class="discord-field-title">{{ title }}</div>
		<span style="color:'#DCDDDE'"><slot></slot></span>
	</div>
</template>

<script>
export default {
	name: "EmbedField",
	props: {
		title: {
			type: String,
			required: true,
		},
		inline: Boolean,
	},
};
</script>

<style scoped>
.discord-embed .discord-embed-field {
	min-width: 100%;
	margin-top: 5px;
}
.discord-embed .discord-embed-field.discord-inline-field {
	flex-grow: 1;
	flex-basis: auto;
	min-width: 100px;
}
.discord-embed .discord-embed-field .discord-field-title {
	color: #fff;
	font-weight: 500;
	margin-bottom: 2px;
}
.discord-light-theme .discord-embed .discord-embed-field .discord-field-title {
	color: #fff;
}
</style>
