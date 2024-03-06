<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useLunwenStore } from "../Store";
const lunwenStore = useLunwenStore();
 
 
</script>

<template>
<v-card
      class="rr d-none d-md-block sidebar"
      prepend-icon="mdi-cog"
 
    >
      <template v-slot:title>
        论文提纲
      </template>

      <template v-slot:text>


        <perfect-scrollbar  class="chat-area" >

      </perfect-scrollbar>
      </template>
    </v-card>
</template>

<style scoped lang="scss">
 .chat-area {
    height: calc(100vh - 440px);
 
    }
    
    </style>