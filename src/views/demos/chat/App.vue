<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import ChatMenu from "./components/ChatMenu.vue";
import { useChatStore } from "./chatStore";
import { useDisplay } from "vuetify";
import { isNumberObject } from "util/types";

const { mobile } = useDisplay();
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
  return mobile.value && chatStore.showSetting ? "mobile-show-right" : "";
});
chatStore.stop = "[\\n\\n" + chatStore.chatHistory.me.name + ":],[\\n" + chatStore.chatHistory.me.name + ":],["+chatStore.chatHistory.me.name + ":]"

const model = ref("");
const states = ref<any>([]);

window.Ai00Api.oai_models((res: any) => {
  console.log(res);
  model.value = res.data[0].id;
  chatStore.Model = model.value;
});

const stateids = ref<string[]>([]);
const statenames = ref<string[]>([]);

stateids.value = ["NULL"];
statenames.value = ["NULL"];

const rules = ref([
  (value) => Number(value) < 65537 || "Between 1 - 65536",
  (value) => Number(value) > 0 || "Between 1 - 65536",
]);

window.Ai00Api.models_info((res: any) => {
  states.value = res.states;
  console.log(states.value);
  //把所有id取出来将“00000000-0000-0000-0000-000000000001”变为数字，组成一个string[]

  states.value.map((item: any) => {
    stateids.value.push(item.id);
    statenames.value.push(item.name);
  });

  console.log(stateids);
});

watch(
  () => chatStore.statename,
  (newVal, oldVal) => {
    // 获得statename的对应index 更改对应的chatStore.stateid
    const index = statenames.value.indexOf(newVal);
    chatStore.stateid = stateids.value[index];
    console.log(chatStore.stateid);
  }
);

watch(
  () => chatStore.Sampler_Nucleus.penalty,
  (newVal, oldVal) => {
     chatStore.Sampler_Nucleus.penalty_decay =  Math.exp(-0.69314718055994 / Number(chatStore.Sampler_Nucleus.penalty));

  }
);

watch(
  () => chatStore.Sampler_Typical.penalty,
  (newVal, oldVal) => {
     chatStore.Sampler_Typical.penalty_decay =  Math.exp(-0.69314718055994 / Number(chatStore.Sampler_Typical.penalty));

  }
);


watch(
  () => chatStore.chatHistory.me.name,
  (newVal, oldVal) => {
     chatStore.stop = "[\\n\\n" + newVal + ":],[\\n" + newVal + ":],["+newVal + ":]"
  }
);



</script>

<template>
  <v-container class="app-container pa-xl-8 pa-lg-8 pa-md-8 pa-sm-8">
    <!-- ---------------------------------------------- -->
    <!-- Side Bar -->
    <!-- ---------------------------------------------- -->
    <v-card
      :class="chatStore.Sidebar ? 'lls ' : 'll d-none d-md-block sidebar'"
      v-if="chatStore.Sidebar"
    >
      <div style="padding: 10px">
        <ChatMenu />
      </div>
    </v-card>
    <!-- ---------------------------------------------- -->
    <!--  List  -->
    <!-- ---------------------------------------------- -->
    <v-card :class="['main', mainClass]">
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
        <perfect-scrollbar ref="target" id="ca1-area" class="ca1-area">
          <v-select
            label="Intial State"
            :items="statenames"
            v-model="chatStore.statename"
            variant="outlined"
          ></v-select>
          <v-text-field
        v-model="chatStore.stop"
        label="Stop Words"
        variant="outlined"
        class="mt-5"
      ></v-text-field>
          <v-textarea
            v-model="chatStore.bnf_schema"
            label="BNF Schema"
            outlined
            dense
            variant="outlined"
            class="mt-5"
          ></v-textarea>
          <v-select
            label="Sampler Type"
            :items="['Nucleus', 'Mirostat', 'Typical']"
            v-model="chatStore.SamplerType"
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
              v-model="chatStore.Sampler_Nucleus.top_p"
              color="primary"
              :min="0"
              :max="1"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Top K </v-card-text>
            <v-text-field
              :rules="rules"
              variant="outlined"
              v-model="chatStore.Sampler_Nucleus.top_k"
            >
              <template v-slot:append>
                <v-icon
                  color="red"
                  @click="
                    chatStore.Sampler_Typical.top_k < 65536
                      ? chatStore.Sampler_Nucleus.top_k++
                      : 655336
                  "
                >
                  mdi-plus
                </v-icon>
              </template>
              <template v-slot:prepend>
                <v-icon
                  color="green"
                  @click="
                    chatStore.Sampler_Typical.top_k > 1
                      ? chatStore.Sampler_Nucleus.top_k--
                      : 1
                  "
                >
                  mdi-minus
                </v-icon>
              </template>
            </v-text-field>

            <v-card-text> Temperature </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Nucleus.temperature"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Presence Penalty </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Nucleus.presence_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Frequency Penalty </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Nucleus.frequency_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Half Life </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Nucleus.penalty"
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
              v-model="chatStore.Sampler_Mirostat.tau"
              color="primary"
              :min="1"
              :max="6"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Learning_rate </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Mirostat.rate"
              color="primary"
              :min="0"
              :max="1"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
          </div>
          <div v-if="chatStore.SamplerType == 'Typical'">
            <v-card-text> Tau </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Typical.tau"
              color="primary"
              :min="0"
              :max="1"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Top K </v-card-text>
            <v-text-field
              :rules="rules"
              variant="outlined"
              v-model="chatStore.Sampler_Typical.top_k"
            >
              <template v-slot:append>
                <v-icon
                  color="red"
                  @click="
                    chatStore.Sampler_Typical.top_k < 65536
                      ? chatStore.Sampler_Typical.top_k++
                      : 655336
                  "
                >
                  mdi-plus
                </v-icon>
              </template>
              <template v-slot:prepend>
                <v-icon
                  color="green"
                  @click="
                    chatStore.Sampler_Typical.top_k > 1
                      ? chatStore.Sampler_Typical.top_k--
                      : 1
                  "
                >
                  mdi-minus
                </v-icon>
              </template>
            </v-text-field>

            <v-card-text> Temperature </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Typical.temperature"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Presence Penalty </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Typical.presence_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Frequency Penalty </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Typical.frequency_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Half Life </v-card-text>
            <v-slider
              v-model="chatStore.Sampler_Typical.penalty"
              color="primary"
              :min="100"
              :max="1000"
              :step="10"
              thumb-label="always"
            ></v-slider>
          </div>
        </perfect-scrollbar>
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
  .main.mobile-show-right {
    margin-left: -300px;
  }
  .rr {
    flex-basis: 270px;
    margin-left: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .ll {
    flex-basis: 270px;
    margin-right: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  .lls {
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

.ca {
  height: calc(100vh - 104px);
}

.ca1-area {
  height: calc(100vh - 220px);
  padding: 10px 10px 0px 0px;
}
</style>
