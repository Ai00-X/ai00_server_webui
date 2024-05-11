<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useTodoStore } from "../Store";
const todoStore = useTodoStore();

const states = ref<any[]>([]);
const stateids = ref<string[]>([]);

stateids.value = ["NULL"];


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
<v-card
      class="rr d-none d-md-block sidebar"
      prepend-icon="mdi-cog"

    >
      <template v-slot:title>
        {{ $t("write.settings") }}
      </template>

      <template v-slot:text>
        <v-select
  label="Sampler Type"
  :items="['Nucleus', 'Mirostat']"
  v-model="todoStore.SamplerType"
  variant="outlined"
></v-select>
        <v-card-text> Max Tokens </v-card-text>
        <v-slider
          v-model="todoStore.Max_Tokens"
          color="primary"
          :min="100"
          :max="8000"
          :step="100"
          thumb-label="always"
        ></v-slider>
        <div v-if="todoStore.SamplerType == 'Nucleus'">
        <v-card-text> Top P </v-card-text>
        <v-slider
          v-model="todoStore.TOP_P"
          color="primary"
          :min="0"
          :max="1"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Temperature </v-card-text>
        <v-slider
          v-model="todoStore.Temperature"
          color="primary"
          :min="0"
          :max="2"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Presence Penalty </v-card-text>
        <v-slider
          v-model="todoStore.Presence"
          color="primary"
          :min="0"
          :max="2"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        <v-card-text> Frequency Penalty </v-card-text>
        <v-slider
          v-model="todoStore.Frequency"
          color="primary"
          :min="0"
          :max="2"
          :step="0.1"
          thumb-label="always"
        ></v-slider>
        <v-card-text> Half Life </v-card-text>
        <v-slider
          v-model="todoStore.Penalty"
          color="primary"
          :min="100"
          :max="1000"
          :step="10"
          thumb-label="always"
        ></v-slider>
        </div>
        <div v-if="todoStore.SamplerType == 'Mirostat'">
        <v-card-text> Tau </v-card-text>
        <v-slider
          v-model="todoStore.tau"
          color="primary"
          :min="1"
          :max="6"
          :step="0.1"
          thumb-label="always"
        ></v-slider>
        <v-card-text> Learning_rate </v-card-text>
        <v-slider
          v-model="todoStore.rate"
          color="primary"
          :min="0"
          :max="1"
          :step="0.1"
          thumb-label="always"
        ></v-slider>

        </div>
        <v-select
  label="State Tuned"
  :items="stateids"
  v-model="todoStore.state"
  variant="outlined"
></v-select>
        <v-textarea
          v-model="todoStore.bnf_schema"
          label="bnf_schema"
          outlined
          dense
          class="mt-5"
        ></v-textarea>
      </template>
    </v-card>
</template>

<style scoped lang="scss"></style>
