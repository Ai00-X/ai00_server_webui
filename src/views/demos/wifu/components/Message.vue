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
      <v-img
        :src="
          isUserMessage
            ? message.user.avatar
            : ChatStore.chatHistory[0].user.avatar
        "
      />
    </v-avatar>

    <v-card
      :class="isUserMessage ? ' w-auto ml-5 mr-n8 sss' : ' w-auto mr-5 ml-n8 '"
      :theme="isUserMessage ? ' dark' : ' light'"
      :style="
        isUserMessage
          ? ' white-space: pre-wrap;word-break: break-all; min-width: 300px; max-width: 500px'
          : ' white-space: pre-wrap;word-break: break-all; min-width: 300px; max-width: 500px'
      "
    >
      <chat-labelai v-if="!isUserMessage" :text="message.text" />
      <chat-labeluser v-if="isUserMessage" :text="message.text" />

      <v-card-actions class="card-actions">
        <div class="close"                 v-if="!isUserMessage">
      <v-btn @click=""  density="compact" icon="mdi-reload"  size="small">  </v-btn> 
      <v-btn @click="deleteMessage(message.id)"  density="compact" icon="mdi-close" size="small">  </v-btn> 
    
     </div>

        <span
          v-if="!isUserMessage"
          style="color: rgb(var(--v-theme-primary); width:138px ;"
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
          style="color: rgb(var(--v-theme-primary); width:138px;"
        >
          {{ date }}
        </span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.sss {
  background: rgba(var(--v-theme-primary), 0.2);
}

.card-actions {
  min-height: 18px;
}

.close {
  position: absolute;
  right: 0;
  top: 0px;
  z-index: 1;
  cursor: pointer;
 
 
}
</style>
