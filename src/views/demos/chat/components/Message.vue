<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import ChatLabelai from "./ChatLabelai.vue";
import ChatLabeluser from "./ChatLabeluser.vue";
import { useChatStore } from "../chatStore";
import clipboard from "@/utils/clipboardUtils";
import {ChatListStore} from "@/views/demos/chat/chatlistStore";
import type {ChatMessage, Message, User} from "@/views/demos/chat/chatTypes";
import * as ai00Type from "@/ai00sdk/ai00Type";
const ChatStore = useChatStore();
const props = defineProps({
  // Message to display
  message: {
    type: Object,
    default: () => ({}),
  },
});

// SnackBar
const snackbar = ref(false);
const timeout = ref("1000");
const copiedText = "Copied to clipboard!";

const dialog = ref(false);

const isUserMessage = computed(() => {
  return props.message.user.id === 1;
});

const date = new Date(props.message.timestamp).toLocaleString("en-US", {
  hour12: false,
  timeZone: "Asia/Singapore",
});

const copyText = (event: Event) => {
  //console.log(props.message.text);
  clipboard(props.message.text, event);
  // props.message.text = props.message.text + "12312"
  snackbar.value = true;
};

function deleteMessage(id: string) {
  ChatStore.deleteMessage(id);
}
const chatStore = useChatStore();
const ChatList = ChatListStore();
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
const sendMessage = () => {
  // 判断是否为空

  if (chatStore.isChatting) {
    return;
  }
  // 发送User Message
  chatStore.removeOtherMessage(
    props.message.timestamp
  );

  // 请求AI回答
  console.log(chatStore.getLatestMessage().text);
  sendChatMessage(chatStore.getLatestMessage().text);
};

const sendChatMessage = async (content: string) => {
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
      await window.Ai00Api.oai_chat_completions(body, async (res: string) => {
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
      await window.Ai00Api.oai_chat_completions(body, async (res: string) => {
        chatStore.changeLatestMessage(res);
      });

      // 调用 window.Ai00Api.oai_chat_completions 函数，传入参数：
      // body 参数数据结构是 /ai00sdk/ai00Type.ts 中定义 的 ai00Type.OaiChatCompletionsType
      // console.log("111")
    }

    // 调用 window.Ai00Api.oai_chat_completions 函数，传入参数：
    // body 参数数据结构是 /ai00sdk/ai00Type.ts 中定义 的 ai00Type.OaiChatCompletionsType
    // console.log("111")
    // window.Ai00Api.oai_chat_completions(body, async (res: string) => {
    //   chatStore.changeLatestMessage(res);
    // });
  } catch (error: any) {
    chatStore.setChatting(false);
  } finally {
    chatStore.setChatting(false);
  }
};

</script>

<template>
  <div
    class="d-flex justify-align-start"
    :class="{ 'flex-row-reverse': isUserMessage }"
  >
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ copiedText }}
    </v-snackbar>

    <v-avatar
      size="40"
      class="elevation-1 grey lighten-3 ma-1"
      :class="isUserMessage ? 'bg-shades-white' : 'bg-primary'"
      style="z-index: 22; top: -20px"
    >
      <v-img :src="message.user.avatar" />
    </v-avatar>

    <v-card
      :class="isUserMessage ? ' w-auto ml-5 mr-n8 sss' : ' w-auto mr-5 ml-n8 '"
      :theme="isUserMessage ? ' dark' : ' light'"
      :style="
        isUserMessage
          ? ' white-space: pre-wrap;word-break: break-all; min-width: 320px;'
          : ' white-space: pre-wrap;word-break: break-all; min-width: 320px;'
      "
    >
      <chat-labelai v-if="!isUserMessage" :text="message.text" />
      <chat-labeluser v-if="isUserMessage" :text="message.text" />

      <v-card-actions class="card-actions">
        <div class="close" v-if="!isUserMessage">
          <v-btn
            @click="sendMessage"
            density="compact"
            icon="mdi-reload"
            size="small"
            color="primary"
          >
          </v-btn>
          <v-btn
            @click="deleteMessage(message.id)"
            density="compact"
            icon="mdi-close"
            size="small"
            color="primary"
          >
          </v-btn>
        </div>

        <span
          v-if="!isUserMessage"
          style="color: rgb(var(--v-theme-primary)); width: 144px"
        >
          {{ date }}
        </span>
        <v-spacer v-if="!isUserMessage"></v-spacer>

        <v-btn
          density="compact"
          color="primary"
          size="small"
          v-bind="props"
          @click="copyText"
          >copy
        </v-btn>

        <v-dialog v-model="dialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <v-btn density="compact" color="primary" size="small" v-bind="props"
              >Edit
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-card-title>
                <span class="text-h5">Edit</span>
              </v-card-title>
              <v-container>
                <v-textarea v-model="message.text"></v-textarea>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="dialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-spacer v-if="isUserMessage"></v-spacer>
        <span
          v-if="isUserMessage"
          style="color: rgb(var(--v-theme-primary)); width: 140px"
        >
          {{ date }}
        </span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.sss {
  background: rgba(var(--v-theme-primary), 0.15);
}

.card-actions {
  min-height: 18px;
  background-color: #ffffff;
}

.close {
  position: absolute;
  right: 0;
  top: 0px;
  z-index: 1;
  cursor: pointer;
}
</style>
