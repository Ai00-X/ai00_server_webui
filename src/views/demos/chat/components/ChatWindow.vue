<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
  import InputArea from "./InputArea.vue";
  import MessageArea from "./MessageArea.vue";
  import ChatTitle from "./ChatTitle.vue";
  import { useChatStore } from "../chatStore";
  import * as htmlToImage from 'html-to-image';


  import { watch,nextTick } from "vue"

  const goClipboard = async () => {
  const element = document.getElementById("po");
  if (element) {
    const blob = await htmlToImage.toBlob(element, { cacheBust: true,  skipFonts: true,skipAutoScale: true, backgroundColor: '#f8f8f8' })
    if (blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
    }
  }
};
  const chatStore = useChatStore();
  const target = ref();

  // scroll to bottom
  const scrollToBottom = () => {
    const chatArea = document.getElementById("chat-area");


    setTimeout(function(){

      chatArea?.scrollTo({
      top: chatArea?.scrollHeight,
    });

},100);

  };

  const scrollToBottom2 = () => {
    const chatArea = document.getElementById("chat-area");
    target.value.update()

      chatArea?.scrollTo({
      top: chatArea?.scrollHeight,
    });


  };

  const settings = () => {
    chatStore.setSettings()
  };

  // scroll to top
  const scrollToTop = () => {
    const chatArea = document.getElementById("chat-area");
    chatArea?.scrollTo({
      top: 0,
    });
  };

  const clear = () => {
    scrollToTop();
    chatStore.clearHistory();
    setTimeout(() => {
        scrollToTop();
      }, 500);


 };

  const ischat = computed(() => {
    return useChatStore().isChatting;
  });
  const cancelSend=()=>{
    window.Ai00Api.cancelSend();
  }
 watch(
  () => chatStore.nowchat,
  () => {
    nextTick(() => {
      scrollToBottom()
    });
  },
  { deep: true }
);

//监视chatStone.getLatestMessage()的变化，如果有变化，就滚动到底部
watch(
  () => chatStore.getLatestMessage(),
  () => {
    nextTick(() => {
      scrollToBottom()
    });
  },
  { deep: true }
);
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Header Area -->
  <!-- ---------------------------------------------- -->
  <v-toolbar class="bg-primary">

    <div class="mx-2 pa-1  flex-grow-1  ">
      <v-btn icon @click="chatStore.Sidebar = !chatStore.Sidebar" :title="!chatStore.Sidebar ? '显示工具栏':'隐藏工具栏'">
        <v-icon :icon="chatStore.Sidebar ? ' mdi-chevron-left':' mdi-chevron-right'"></v-icon>
      </v-btn>

    </div>
    <template v-slot:append>


      <v-btn icon @click="goClipboard" title="Copy 对话图片到剪贴板">
        <v-icon>mdi-image-album</v-icon>
      </v-btn>
      <v-btn icon @click="settings" title="设置">
        <v-icon>mdi-tune-variant</v-icon>
      </v-btn>
    </template>

  </v-toolbar>
  <!-- ---------------------------------------------- -->
  <!---Chat Area -->
  <!-- ---------------------------------------------- -->
  <perfect-scrollbar ref="target" id="chat-area" class="chat-area" >
    <!-- ---------------------------------------------- -->
    <!---Message Area -->
    <!-- ---------------------------------------------- -->

    <v-sheet elevation="0" color="transparent" class="messages-area" id="po">
      <ChatTitle />
      <MessageArea />
      <br/>
    </v-sheet>
    <!-- ---------------------------------------------- -->
    <!---Input Area -->
    <!-- ---------------------------------------------- -->
  </perfect-scrollbar>
  <div  v-if="ischat" style="display: flex; justify-content: center; align-items: center; margin-top: -10px; margin-bottom: 10px;">
    <span>停止输出</span>
    <v-icon  @click="cancelSend" color="primary">mdi-pause</v-icon>
  </div>
  <v-sheet class="input-area">
    <InputArea @scroll="scrollToBottom2" />
  </v-sheet>

</template>

<style scoped lang="scss">


  .chat-area {
    height: calc(100vh - 340px);
    background-color: #f8f8f8;



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

</style>
