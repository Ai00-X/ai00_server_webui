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
const statenames = ref<string[]>([]);

stateids.value = ["NULL"];
statenames.value = ["NULL"];

window.Ai00Api.models_info((res: any) => {
  states.value = res.states;
  console.log(states.value);
  //把所有id取出来将“00000000-0000-0000-0000-000000000001”变为数字，组成一个string[]
  //stateids.value = states.value.map((item: any) => parseInt(item.id.replace(/-/g,"")))

  states.value.map((item: any) => {
    stateids.value.push(item.id);
    statenames.value.push(item.name);
  });

  console.log(stateids);
});
const rules = ref([
  (value) => Number(value) < 65537 || "Between 1 - 65536",
  (value) => Number(value) > 0 || "Between 1 - 65536",
]);
watch(
  () => todoStore.state_name,
  (newVal, oldVal) => {
    // 获得statename的对应index 更改对应的todoStore.stateid
    const index = statenames.value.indexOf(newVal);
    todoStore.state = stateids.value[index];
    console.log(todoStore.state);
  }
);

watch(
  () => todoStore.Sampler_Nucleus.penalty,
  (newVal, oldVal) => {
    todoStore.Sampler_Nucleus.penalty_decay =  Math.exp(-0.69314718055994 / Number(todoStore.Sampler_Nucleus.penalty));

  }
);

watch(
  () => todoStore.Sampler_Typical.penalty,
  (newVal, oldVal) => {
    todoStore.Sampler_Typical.penalty_decay =  Math.exp(-0.69314718055994 / Number(todoStore.Sampler_Typical.penalty));

  }
);

</script>

<template>
  <v-card class="rr d-none d-md-block sidebar" prepend-icon="mdi-cog">
    <template v-slot:title>
      {{ $t("write.settings") }}
    </template>

    <template v-slot:text>
      <perfect-scrollbar ref="target" id="card1-area" class="card1-area">
        <v-textarea
        v-model="todoStore.bnf_schema"
        label="BNF Schema"
        variant="outlined"
        class="mt-5"
      ></v-textarea>
      <v-text-field
        v-model="todoStore.stop"
        label="Stop Words"
        variant="outlined"
        class="mt-5"
      ></v-text-field>
      <v-select
        label="Initial State"
        :items="statenames"
        v-model="todoStore.state_name"
        variant="outlined"
      ></v-select>


      <v-select
            label="Sampler Type"
            :items="['Nucleus', 'Mirostat', 'Typical']"
            v-model="todoStore.SamplerType"
            variant="outlined"
          ></v-select>


      <v-divider
  :thickness="2"
  class="border-opacity-100"
  color="primary"
></v-divider>
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
              v-model="todoStore.Sampler_Nucleus.top_p"
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
              v-model="todoStore.Sampler_Nucleus.top_k"
            >
              <template v-slot:append>
                <v-icon
                  color="red"
                  @click="
                    todoStore.Sampler_Typical.top_k < 65536
                      ? todoStore.Sampler_Nucleus.top_k++
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
                    todoStore.Sampler_Typical.top_k > 1
                      ? todoStore.Sampler_Nucleus.top_k--
                      : 1
                  "
                >
                  mdi-minus
                </v-icon>
              </template>
            </v-text-field>

            <v-card-text> Temperature </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Nucleus.temperature"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Presence Penalty </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Nucleus.presence_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Frequency Penalty </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Nucleus.frequency_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Half Life </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Nucleus.penalty"
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
              v-model="todoStore.Sampler_Mirostat.tau"
              color="primary"
              :min="1"
              :max="6"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Learning_rate </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Mirostat.rate"
              color="primary"
              :min="0"
              :max="1"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
          </div>
          <div v-if="todoStore.SamplerType == 'Typical'">
            <v-card-text> Tau </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Typical.tau"
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
              v-model="todoStore.Sampler_Typical.top_k"
            >
              <template v-slot:append>
                <v-icon
                  color="red"
                  @click="
                    todoStore.Sampler_Typical.top_k < 65536
                      ? todoStore.Sampler_Typical.top_k++
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
                    todoStore.Sampler_Typical.top_k > 1
                      ? todoStore.Sampler_Typical.top_k--
                      : 1
                  "
                >
                  mdi-minus
                </v-icon>
              </template>
            </v-text-field>

            <v-card-text> Temperature </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Typical.temperature"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Presence Penalty </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Typical.presence_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>

            <v-card-text> Frequency Penalty </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Typical.frequency_penalty"
              color="primary"
              :min="0"
              :max="2"
              :step="0.1"
              thumb-label="always"
            ></v-slider>
            <v-card-text> Half Life </v-card-text>
            <v-slider
              v-model="todoStore.Sampler_Typical.penalty"
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
</template>

<style scoped lang="scss">

.card1-area {
  height: calc(100vh - 180px);
  padding: 10px 10px 0px 0px;

}
</style>
