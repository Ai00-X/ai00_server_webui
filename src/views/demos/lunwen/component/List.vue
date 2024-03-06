<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useLunwenStore } from "../Store";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import * as ai00Type from "@/ai00sdk/ai00Type";

const lunwenStore = useLunwenStore();


 
</script>

<template>
  <v-card height="100%" prepend-icon="mdi-file-document-edit"  >
    <template v-slot:title>
      {{ $t("write.contens") }}
    </template>
    <template v-slot:text>
      <v-card-text>
        <perfect-scrollbar class="scroll">
        <div v-for="(tigang, index) in lunwenStore.tigangs" :key="index">
          <div v-if="tigang.type === 'title'" style="font-size: 24px;margin-bottom: 20px;">{{  tigang.title }} </div>
 
            <v-textarea
              v-if="tigang.type != 'title'"
              v-model="tigang.content"
              :label="tigang.title"
              auto-grow
          variant="outlined"
          rows="3"
          row-height="25"
          shaped
              class="editor"
            ></v-textarea>
          </div>
        </perfect-scrollbar>
      </v-card-text>
    </template>
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

.scroll{
  height: calc(100vh - 230px);
}
 
</style>
