<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useTodoStore } from "../Store";
import { MdEditor, ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import * as ai00Type from "@/ai00sdk/ai00Type";
import Copy from "./Copy.vue";
import { useSnackbarStore } from "@/stores/snackbarStore";
import * as htmlToImage from "html-to-image";

const snackbarStore = useSnackbarStore();
const todoStore = useTodoStore();
const ischat = computed(() => {
  return useTodoStore().isChatting;
});
const toolbar = ref<ToolbarNames[]>([
  "bold",
  "underline",
  "italic",
  "-",
  "title",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "table",
  "-",
  "revoke",
  "next",
  "=",
  "prettier",
  "preview",
]);

const sendPrompt = async () => {
  const prompt = todoStore.text;
  const temp: string = todoStore.text;
  try {
    todoStore.setChatting(true);
    let body = todoStore.createBody(prompt);
      await window.Ai00Api.oai_completions(body, async (res: string) => {
        todoStore.text = temp + res;
      });

  } catch (error: any) {
    todoStore.setChatting(false);
  } finally {
    todoStore.setChatting(false);
  }

  // 调用 window.Ai00Api.oai_chat_completions 函数，传入参数：
  // body 参数数据结构是 /ai00sdk/ai00Type.ts 中定义 的 ai00Type.OaiChatCompletionsType
};

const goClipboard = async () => {
  const element = document.getElementById("po");
  if (element) {
    const blob = await htmlToImage.toBlob(element, {
      cacheBust: true,
      skipFonts: true,
      skipAutoScale: true,
      backgroundColor: "#f8f8f8",
    });
    if (blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
    }
    snackbarStore.showSuccessMessage("截图成功");
  }
};
const cancelSend = () => {
  window.Ai00Api.cancelSendNew();
};
const clear = () => {
  if (ischat) {
    window.Ai00Api.cancelSendNew();
  }
  todoStore.text = "";
};
</script>

<template>
  <v-card height="100%" prepend-icon="mdi-file-document-edit">
    <template v-slot:title>
      {{ $t("write.write") }}
      <v-spacer></v-spacer>

      <v-btn color="primary" @click="sendPrompt">
        {{ $t("write.write") }}
      </v-btn>

      <v-btn color="primary" @click="clear" style="margin-left: 30px">{{
        $t("write.clear")
      }}</v-btn>

      <v-btn color="primary" @click="goClipboard" style="margin-left: 30px">{{
        $t("write.screenshot")
      }}</v-btn>
      <v-btn
        v-if="ischat"
        color="primary"
        @click="cancelSend"
        style="margin-left: 30px"
        >{{ $t("write.stop") }}</v-btn
      >
    </template>
    <v-card-text>
      <MdEditor
        v-model="todoStore.text"
        :toolbars="toolbar"
        class="editor"
        :preview="false"
      />
      <div class="hidejietu" id="po">
        <Copy :text="todoStore.text + '\n\n'" />
        <p style="margin-top: 20px">
          ✅ Powered by AI00 for RWKV (
          https://github.com/cgisky1980/ai00_rwkv_server )
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.todo-list {
  height: 100%;

  .todo-item {
    transition: all 0.3s;
    border-bottom: 1px solid #eee;
    &:hover {
      transition: all 0.3s;
      background-color: rgba(99, 99, 99, 0.2);
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
      cursor: pointer;
    }
  }
}

.editor {
  height: calc(100vh - 200px);
}

.hidejietu {
  margin-top: 20px;
  padding: 20px;
}
</style>
