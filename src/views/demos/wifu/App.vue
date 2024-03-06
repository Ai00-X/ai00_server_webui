<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import ChatMenu from "./components/ChatMenu.vue";
import { useChatStore } from "./chatStore";

const chatStore = useChatStore();

if(window.location.host == "localhost:4399"){
  chatStore.setserverip("127.0.0.1:65530");
}else{
  chatStore.setserverip(window.location.host)
}
//chatStore.setserverip("127.0.0.1:65530");

const issettings = ref(true);

issettings.value = chatStore.getSettings();


  const model = ref("")

  window.Ai00Api.oai_models((res: any) => {
    model.value = res.data[0].id
    chatStore.Model = model.value
  })
/*
  async function getModles() {
    
  const result = await fetch('http://127.0.0.1:65530/api/oai/models', {
      method: 'get',
      // signal: AbortSignal.timeout(8000),
      // 开启后到达设定时间会中断流式输出
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 1`,
      },

    })

    const modelss = await result.json();
    model.value = modelss.data[0].id
    chatStore.Model = model.value
  }

  getModles()*/
 
</script>

<template>
  <v-container class="app-container pa-xl-8 pa-lg-8 pa-md-8 pa-sm-8">
    <!-- ---------------------------------------------- -->
    <!-- Side Bar -->
    <!-- ---------------------------------------------- -->
    <v-card :class="chatStore.Sidebar ? 'lls ' : 'll d-none d-md-block sidebar'" v-if="chatStore.Sidebar"> 

      <div style="padding: 10px">
        <ChatMenu />
      </div>

  </v-card>
    <!-- ---------------------------------------------- -->
    <!--  List  -->
    <!-- ---------------------------------------------- -->
    <v-card class="main " >
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-card>
    <v-card
      :class="chatStore.settings ? 'rr ' : 'rr d-none d-md-block sidebar'"
      prepend-icon="mdi-cog"
      v-if="chatStore.settings"
    >
      <template v-slot:title>
        {{ $t("chat.settings") }}
      </template>

      <template v-slot:text>

        <v-card-text> Max Tokens </v-card-text>
        <v-slider
          v-model="chatStore.Max_Tokens"
          color="primary"
          :min="100"
          :max="8000"
          :step="100"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Top P </v-card-text>
        <v-slider
          v-model="chatStore.TOP_P"
          color="primary"
          :min="0"
          :max="1"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Temperature </v-card-text>
        <v-slider
          v-model="chatStore.Temperature"
          color="primary"
          :min="0"
          :max="2"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Presence Penalty </v-card-text>
        <v-slider
          v-model="chatStore.Presence"
          color="primary"
          :min="0"
          :max="2"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Frequency Penalty </v-card-text>
        <v-slider
          v-model="chatStore.Frequency"
          color="primary"
          :min="0"
          :max="2"
          :step="0.1"
          thumb-label="always"
        ></v-slider>
        <v-card-text> Half Life </v-card-text>
        <v-slider
          v-model="chatStore.Penalty"
          color="primary"
          :min="100"
          :max="1000"
          :step="10"
          thumb-label="always"
        ></v-slider>
      </template>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
 
  font-size: 14px;

  .main {
    flex: 1;
    height: 100%;

  }
  .rr {
    flex-basis: 270px;
    margin-left: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .ll{
    flex-basis: 270px;
    margin-right: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
}

.lls{
    flex-basis: 270px;
    margin-right: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
}
}

.app-pa1 {
  padding: 0px;
}
.app-pa2 {
  padding: 20px;
}


</style>
