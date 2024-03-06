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
  <transition-group name="list">
    <perfect-scrollbar ref="target" id="chat-area" class="chat-area" >
    <Message
      v-for="message in chatStore.chatHistory"
      :key="message.id"
      :message="message"
      class="my-12 d-flex "
    />


  </perfect-scrollbar>
  <div id="pixi-container"></div>
  </transition-group>
</template>

<style scoped lang="scss">
  .chat-area {
    height: calc(100vh - 325px);
    background-color: #f8f8f8;
    padding-top: 100px;



 margin-bottom: 20px;
    .input-area {
      position: fixed;
      width: 100%;
      height: 300px;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0);
    }
  }
  #pixi-container{
  position: absolute;
  z-index: 1000;
  top: 60px;
  
  width: 100%;
  height: calc(100vh - 320px);
  canvas{
    width: 100%;
    height: 100%;
    
  }
 

}
</style>
