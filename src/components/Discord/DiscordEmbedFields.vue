<template>
	<div class="discord-embed-fields">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "EmbedFields",
};
</script>

<style scoped>
.discord-embed .discord-embed-fields {
	display: flex;
	flex-wrap: wrap;
	margin-top: 8px;
}
</style>
