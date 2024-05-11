<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import ChatMenu from "./components/ChatMenu.vue";
import { useChatStore } from "./chatStore";
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const chatStore = useChatStore();


const disableSettingsOnMobile = () => {
  chatStore.showSetting = !mobile.value;
  chatStore.Sidebar = !mobile.value;
};

onMounted(() => {
  disableSettingsOnMobile();
});

watch(mobile, (newValue) => {
  disableSettingsOnMobile();
});

const mainClass = computed(() => {
  return mobile.value && chatStore.showSetting ? 'mobile-show-right' : '';
});

  const model = ref("")
  const states = ref<any>([])

  window.Ai00Api.oai_models((res: any) => {
    console.log(res)
    model.value = res.data[0].id
    chatStore.Model = model.value
  });

  const stateids = ref<string[]>([]);

  stateids.value = [""];


  window.Ai00Api.models_info((res: any) => {

    states.value = res.states
    console.log(states.value)
    //把所有id取出来将“00000000-0000-0000-0000-000000000001”变为数字，组成一个string[]
    //stateids.value = states.value.map((item: any) => parseInt(item.id.replace(/-/g,"")))

    states.value.map((item: any) =>stateids.value.push(item.id))



    console.log(stateids)

  });




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
    <v-card :class="['main', mainClass]" >
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-card>
    <v-card
      :class="chatStore.showSetting ? 'rr ' : 'rr d-none d-md-block sidebar'"
      prepend-icon="mdi-cog"
      v-if="chatStore.showSetting"
    >
      <template v-slot:title>
        {{ $t("chat.settings") }}
      </template>

      <template v-slot:text>

        <v-select
  label="Sampler Type"
  :items="['Nucleus', 'Mirostat']"
  v-model="chatStore.SamplerType"
  variant="outlined"
></v-select>
<v-select
  label="State Tuned"
  :items="stateids"
  v-model="chatStore.state"
  variant="outlined"
></v-select>

<v-card-text> Max Tokens </v-card-text>
        <v-slider
          v-model="chatStore.Max_Tokens"
          color="primary"
          :min="100"
          :max="8000"
          :step="100"
          thumb-label="always"
        ></v-slider>
<div v-if="chatStore.SamplerType == 'Nucleus'">
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
      </div>
      <div v-if="chatStore.SamplerType == 'Mirostat'">
        <v-card-text> Tau </v-card-text>
        <v-slider
          v-model="chatStore.tau"
          color="primary"
          :min="1"
          :max="6"
          :step="0.1"
          thumb-label="always"
        ></v-slider>
        <v-card-text> Learning_rate </v-card-text>
        <v-slider
          v-model="chatStore.rate"
          color="primary"
          :min="0"
          :max="1"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

      </div>
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
  } .main.mobile-show-right {
      margin-left: -300px;
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
