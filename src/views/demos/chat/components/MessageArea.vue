<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import Message from "./Message.vue";
import { useChatStore } from "../chatStore";
const chatStore = useChatStore();
</script>

<template>

    <Message
      v-for="message in chatStore.chatHistory.history"
      :key="message.id"
      :message="message"
      class="my-12 "

    />

</template>

<style scoped lang="scss">

</style>
