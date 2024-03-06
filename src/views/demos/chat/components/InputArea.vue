<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import type { User, Message, ChatMessage } from "../chatTypes";
import { ChatListStore } from "../chatlistStore";
import { useChatStore } from "../chatStore";
import { watch, nextTick } from "vue";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import * as ai00Type from "@/ai00sdk/ai00Type";

moment.locale("zh-cn");

const chatStore = useChatStore();
const ChatList = ChatListStore();
const userMessage = ref("");
const aiMessage = ref("");

const createMessage = (user: User, text: string) => {
  const message: Message = {
    id: "_" + Math.random().toString(36).substring(2, 11),
    user: user,
    text: text,
    timestamp: new Date().getTime(),
  };
  return message;
};

const emits = defineEmits(["scroll"]);

const sendMessage = () => {
  // 判断是否为空

  if (chatStore.isChatting) {
    return;
  }

  if (!userMessage.value) return;

  // 发送User Message

  chatStore.addToHistory(
    createMessage(chatStore.chatHistory.me, userMessage.value)
  );

  // AI等待Message
  aiMessage.value = "Please wait a moment ......";

  chatStore.addToHistory(
    createMessage(chatStore.chatHistory.ai, aiMessage.value)
  );

  // 请求AI回答

  sendChatMessage(userMessage.value);

  // 清空Input
  userMessage.value = "";
};

const isError = ref(false);
const ischat = ref(false);
const errorMsg = ref("");

watch(
  () => chatStore.chatHistory.history,
  () => {
    ChatList.setHistory(chatStore.chatHistory.history, chatStore.nowchat);
  },
  { deep: true }
);

watch(
  () => chatStore.isChatting,
  () => {
    ischat.value = chatStore.isChatting;
  },
  { deep: true }
);

const sendChatMessage = async (content: string = userMessage.value) => {
  try {
    chatStore.setChatting(true);
    const messlist = chatStore.chatHistory.history;
    const contlist: any[] = [
      {
        role: "user",
        content: "Hi!",
      },
    ];

    // const contlist =

    for (let index = 0; index < messlist.length - 1; index++) {
      const element = messlist[index];
      let chatm: ChatMessage = {
        role: element.user.id == 1 ? "user" : "assistant",
        content: element.text,
      };
      contlist.push(chatm);
    }

    /*定义要传送给    window.Ai00Api.oai_chat_completions  的 body参数 ，
  结构为 ai00Type.OaiChatCompletionsType
  */
    if (chatStore.SamplerType == "Nucleus") {
      const body: ai00Type.OaiChatCompletionsType = {
        messages: contlist,
        max_tokens: chatStore.Max_Tokens,
        temperature: chatStore.Temperature,
        top_p: chatStore.TOP_P,
        presence_penalty: chatStore.Presence,
        frequency_penalty: chatStore.Frequency,
        penalty_decay: Math.exp(-0.69314718055994 / Number(chatStore.Penalty)),
        stop: [
          "\n" + chatStore.chatHistory.me.name + ":",
          chatStore.chatHistory.me.name + ":",
        ],
        stream: true,
        names: {
          user: chatStore.chatHistory.me.name,
          assistant: chatStore.chatHistory.ai.name,
        },
      };
      window.Ai00Api.oai_chat_completions(body, async (res: string) => {
        chatStore.changeLatestMessage(res);
      });
    } else if (chatStore.SamplerType == "Mirostat") {
      const body: ai00Type.OaiChatCompletionsType = {
        messages: contlist,
        max_tokens: chatStore.Max_Tokens,
        tau: chatStore.tau,
        rate:chatStore.rate,
        stop: [
          "\n" + chatStore.chatHistory.me.name + ":",
          chatStore.chatHistory.me.name + ":",
        ],
        stream: true,
        names: {
          user: chatStore.chatHistory.me.name,
          assistant: chatStore.chatHistory.ai.name,
        },
      };
      window.Ai00Api.oai_chat_completions(body, async (res: string) => {
        chatStore.changeLatestMessage(res);
      });

      // 调用 window.Ai00Api.oai_chat_completions 函数，传入参数：
      // body 参数数据结构是 /ai00sdk/ai00Type.ts 中定义 的 ai00Type.OaiChatCompletionsType
      // console.log("111")
    }

    // 调用 window.Ai00Api.oai_chat_completions 函数，传入参数：
    // body 参数数据结构是 /ai00sdk/ai00Type.ts 中定义 的 ai00Type.OaiChatCompletionsType
    // console.log("111")
    window.Ai00Api.oai_chat_completions(body, async (res: string) => {
      chatStore.changeLatestMessage(res);
    });
  } catch (error: any) {
    chatStore.setChatting(false);
  } finally {
    chatStore.setChatting(false);
  }
};

let res: string[] = ["", "", ""];
res.forEach((item, index) => {
  res[index] = " ";
});
</script>

<template>
  <v-textarea
    v-model="userMessage"
    rows="3"
    row-height="12"
    :label="$t('chat.chating')"
    no-resize
    max-rows="3"
    variant="outlined"
    clear-icon="mdi-close-circle"
    clearable
    :disabled="ischat"
    @keydown.ctrl.enter="sendMessage"
  >
    <template #append>
      <v-btn
        style="margin-right: 20px; height: 70px"
        class="bg-primary"
        @click="sendMessage"
      >
        <v-icon size="25">mdi-account-voice</v-icon></v-btn
      >
    </template>
    <template #prepend>
      <ul style="list-style: none; margin-left: 20px">
        <li style="list-style: none; margin-bottom: 20px">
          <v-icon @click="sendMessage" color="primary">mdi-new-box</v-icon>
        </li>
        <li style="list-style: none; margin-bottom: 15px">
          <v-icon color="#a2a2a2" icon="mdi-web" @click="sendMessage"></v-icon>
        </li>
      </ul>
    </template>
  </v-textarea>
  <v-snackbar :timeout="2000" color="error" v-model="isError">
    {{ errorMsg }}
  </v-snackbar>
</template>

<style scoped lang="scss"></style>
