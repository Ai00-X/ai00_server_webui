<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { ChatListStore } from "../chatlistStore";
import { useChatStore } from "../chatStore";
import type { Message, clist, User } from "../chatTypes";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import "moment/dist/locale/es-us";
import multiavatar from "@multiavatar/multiavatar/esm";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
moment.locale("zh-cn");

const myname = ref("User");
const ainame = ref("Assistant");
const aimeg = ref("");

const getdiff = (timestamp) => {
  moment.locale("zh-cn");
  return moment(Number(timestamp)).fromNow();
};

const ChatList = ChatListStore();

const ChatStore = useChatStore();

const index = ref(0);
const idname = ref("");

 

const newchat = () => {
  if (ChatStore.isChatting) {
    return;
  }

  const idnames = Date.now().toString();
  
  

  const bot: User = {
    id: 2,
    name: ainame.value,
    avatar: toDataURI(ainame.value),
  };

  const you: User = {
    id: 1,
    name: myname.value,
    avatar: toDataURI(myname.value),
  };

  const newchatl: clist = {
    id_name: idnames,
    history: [],
    ai: bot,
    me: you,
  };

  ChatList.addToChatList(newchatl);

  index.value = ChatList.getListnum() - 1;

  ChatStore.setnowchat(idnames);
  idname.value = idnames;

  const hello: Message = {
    id: "_" + Math.random().toString(36).substring(2, 11),
    user: bot,
    text: aimeg.value,
    timestamp: new Date().getTime(),
  };

  ChatStore.startHistory(hello, you, bot);
  ChatList.setHistory(ChatStore.chatHistory.history, ChatStore.nowchat);
  const chatArea = document.getElementById("chat-area");

  chatArea?.scrollTo({
    top: 0,
  });
};

const change = (i: number) => {
  if (ChatStore.isChatting) {
    return;
  }

  console.log(ChatList.ids[i].id_name);
  index.value = i;

  ChatStore.setnowchat(ChatList.ids[i].id_name);

  idname.value = ChatList.ids[i].id_name;

  ChatStore.setHistory(ChatList.ids[i]);

  const chatArea = document.getElementById("chat-area");

  chatArea?.scrollTo({
    top: 0,
  });

  setTimeout(() => {
    chatArea?.scrollTo({
      top: chatArea?.scrollHeight,
    });
  }, 500);
};

const del = (id_name: string) => {
  if (ChatStore.isChatting) {
    return;
  }

  let nowindex = index.value;
  let delindex: number = ChatList.getidbyname(id_name) ?? 0;
  console.log("noewchat:", ChatStore.nowchat);
  console.log(id_name);
  ChatList.removeChatList(id_name);

  if (ChatList.getListnum() == 0) {
    newchat();
  } else if (id_name == ChatStore.nowchat) {
    change(0);
  } else {
    if (nowindex > delindex) {
      index.value = index.value - 1;
    }
  }
};
const REGEX = {
  whitespace: /\s+/g,
  urlHexPairs: /%[\dA-F]{2}/g,
  quotes: /"/g,
};

function specialHexEncode(match: string) {
  switch (match) {
    case "%20":
      return " ";
    case "%3D":
      return "=";
    case "%3A":
      return ":";
    case "%2F":
      return "/";
    default:
      return match.toLowerCase();
  }
}

const toDataURI = (string: string) => {
  const ss = multiavatar(string + 627,true);
  const dataURI = `data:image/svg+xml,${encodeURIComponent(ss)
    .trim()
    .replace(REGEX.whitespace, " ")
    .replace(REGEX.quotes, "'")
    .replace(REGEX.urlHexPairs, specialHexEncode)}`;

  return dataURI;
};
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- Add Task Dialog -->
  <!-- ---------------------------------------------- -->
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" block class="mb-4 w-full" @click="aimeg = t('chat.hello')">
        {{ $t("chat.newchat") }}</v-btn
      >
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        :title="t('chat.newchat')"
        :subtitle="t('chat.tips')"
        prepend-icon="mdi-account"
      >
        <v-card-text
          ><v-divider style="margin-top: 10px; margin-bottom: 30px"></v-divider>
          <v-row>
            <v-col cols="10">
              <v-text-field
                :label="t('chat.youname')"
                variant="outlined"
                v-model="myname"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-img :src="toDataURI(myname)"></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-img :src="toDataURI(ainame)"></v-img>
            </v-col>
            <v-col cols="10">
              <v-text-field
                :label="t('chat.ainame')"
                variant="outlined"
                v-model="ainame"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-textarea
            v-model="aimeg"
            rows="3"
            row-height="12"
            :label="t('chat.text')"
            no-resize
            max-rows="3"
            variant="outlined"
            clear-icon="mdi-close-circle"
            clearable
          >
          </v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :text="t('chat.close')" @click="isActive.value = false"></v-btn>
          <v-btn
            :text="t('chat.ok')"
            @click="
              newchat();
              isActive.value = false;
            "
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <perfect-scrollbar ref="target" id="chat-m" class="chat-m">
    <v-list nav class="mt-2 pa-0" color="primary">
      <v-list-item
        v-for="(item, indexs) of ChatList.ids"
        :key="item.id_name"
        class="newbtn"
        active-class="active-chat"
        :title="getdiff(item.id_name)"
        link
        :active="index === indexs"
        @click="change(indexs)"
      >
        <template v-slot:prepend>
          <v-avatar size="40" class="bg-primary">
            <v-img :src="item.ai.avatar" />
          </v-avatar>
        </template>
        <template #title>
          <v-card style="background-color: rgba(255, 255, 255, 0)">
            <template #title>
              <span style="font-size: 16px">{{ item.ai.name }}</span>
            </template>
            <template #subtitle>
              <span style="font-size: 12px">{{ getdiff(item.id_name) }}</span>
            </template>
          </v-card>
        </template>
        <template v-slot:append>
          <v-btn
            variant="plain"
            size="x-small"
            icon="mdi-close"
            @click="del(item.id_name)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </perfect-scrollbar>
  <!-- <div class="pa-1 mt-2 text-overline text-grey">More Chats</div> -->
</template>

<style scoped lang="scss">
.active-chat {
  border-left: 5px solid;
  border-image-slice: 1;
}

.newbtn {
  overflow: hidden;
}

.chat-m {
  height: calc(100vh - 320px);
  margin-bottom: 20px;
}
</style>
