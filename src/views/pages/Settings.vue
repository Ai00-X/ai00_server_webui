<script setup lang="ts">
const quant = ref(0);
const quantint = ref("None");
const quanttemp = ref(0);

const token_chunk_size = ref(128);
const max_runtime_batch = ref(8);
const max_batch = ref(16);
const modelName = ref("");
const model_path = ref("");
const adapterlist = ref([]);
const embed_device_list = ref(["Cpu", "Gpu"]);
const selectItems = ref<string[]>([]);
const adapterNmae = ref("");
const adapter = ref(0);
const embed_device = ref("Cpu");

interface modelslist {
  name: string;
  size: string;
  sha: string;
}
const models = ref<modelslist[]>([]);

const loading = ref(false);

//获取模型列表
window.Ai00Api.models_list((res: Array<modelslist>) => {
  console.log(res);
  models.value = res;
});

watch(models, (newModels: modelslist[]) => {
  const modelNames = newModels.map((model: modelslist) => model.name);
  selectItems.value = modelNames;
  modelName.value = modelNames[0];
});

watch(modelName, (newModel: string) => {
  model_path.value = "assets/models/" + newModel;
  console.log(model_path.value);
});

//获取显卡设备列表
window.Ai00Api.adapters((res: any) => {
  console.log(res);
  adapterlist.value = res;
  adapterNmae.value = res[0];
});

//watch adapterNmae 将 adapter的值变为 adapterNmae的index
watch(adapterNmae, (newAdapterNmae: string) => {
  adapter.value = adapterlist.value.findIndex(
    (item: any) => item === newAdapterNmae
  );
  console.log(adapter.value);
});

//quantint的值变化时，将quant的值变为对应的值
watch(quantint, (newQuantint: string) => {
  if (newQuantint == "None") {
    quant.value = 0;
  } else {
    quant.value = quanttemp.value;
  }
});

watch(quant, (newQuant: number) => {
  if (quantint.value != "None") {
    quanttemp.value = newQuant;
  }else{
    quanttemp.value = 0;
  }
});

function save_config() {
  //todo
}

function run_model() {
  loading.value = true;
  //调用Ai00API 的models_load 函数 启动模型
  //1. 先初始化 models_load 的参数
    const adapterpost = {
    Manual: adapter.value,
  };
  const model_load_params = {
    model_path: model_path.value,
    adapter: adapterpost,
    quant_type: quantint.value,
    quant: Number(quant.value),
    turbo: true,
    token_chunk_size: Number(token_chunk_size.value),
    max_runtime_batch: Number(max_runtime_batch.value),
    max_batch: Number(max_batch.value),
    tokenizer_path: "assets/tokenizer/rwkv_vocab_v20230424.json",
    embed_device: embed_device.value,
  };
  //2. 调用model_load
  window.Ai00Api.models_load(model_load_params, (res: any) => {
    console.log(res);
    loading.value = false;
  });
}

import { useI18n } from "vue-i18n";

const { t } = useI18n();

</script>
<template>
  <div class="pa-5">
    <!-- ---------------------------------------------- -->
    <!---First Row -->
    <!-- ---------------------------------------------- -->
    <v-row class="flex-0" dense>
      <v-col cols="12" md="6" xl="6" xxl="6">
        <v-card class="cardl" :title='t("dashboard.title1")' prepend-icon="mdi-file-cabinet">
          <template v-slot:text>
            <perfect-scrollbar ref="target" id="card1-area" class="card1-area">
              <v-select
                v-model="modelName"
                color="primary"
                :label='t("settings.subtitle1")'
                :items="selectItems"
                variant="outlined"
              ></v-select>
              <v-select
                v-model="adapterNmae"
                color="primary"
                :label='t("settings.subtitle2")'
                :items="adapterlist"
                variant="outlined"
              ></v-select>
              <v-card
                class="setcard"
                variant="outlined"
                title="quant"
                subtitle="Quantization mode. This could be FP16 or INT8 or NF4."
              >
                <template v-slot:text>
                  <v-radio-group v-model="quantint" inline>
                    <v-radio label="FP16" value="None" color="primary"></v-radio>
                    <v-radio label="INT8" value="Int8" color="primary"></v-radio>
                    <v-radio
                      label="NF4"
                      value="NF4"
                      color="primary"
                    ></v-radio>
                  </v-radio-group>
                  <v-slider
                    v-model="quant"
                    color="primary"
                    :min="0"
                    :max="31"
                    :step="1"
                    thumb-label="always"
                    :disabled="quantint == 'None'"
                  ></v-slider>
                </template>
              </v-card>
              <v-card
                class="setcard"
                variant="outlined"
                title="token_chunk_size"
                subtitle="Size of token chunk. This could be 32 or 64 or 128 (faster)."
              >
                <template v-slot:text>
                  <v-radio-group v-model="token_chunk_size" inline>
                    <v-radio label="32" :value="32" color="primary"></v-radio>
                    <v-radio label="64" :value="64" color="primary"></v-radio>
                    <v-radio label="128" :value="128" color="primary"></v-radio>
                  </v-radio-group>
                </template>
              </v-card>
              <v-card
                class="setcard"
                variant="outlined"
                title="max_runtime_batch"
                subtitle="Maximum number of batches that are active at once."
              >
                <template v-slot:text>
                  <v-text-field
                    label=""
                    variant="outlined"
                    type="number"
                    v-model="max_runtime_batch"
                    color="primary"
                  ></v-text-field>
                </template>
              </v-card>
              <v-card
                class="setcard"
                variant="outlined"
                title="max_batch"
                subtitle="The maximum batches that are cached on GPU."
              >
                <template v-slot:text>
                  <v-text-field
                    label=""
                    type="number"
                    variant="outlined"
                    v-model="max_batch"
                    color="primary"
                  ></v-text-field>
                </template>
              </v-card>

              <v-card
                class="setcard"
                variant="outlined"
                title="embed_device"
                subtitle="The embedding device."
              >
              <template v-slot:text>
              <v-select
                v-model="embed_device"
                color="primary"
                :label='t("settings.subtitle2")'
                :items="embed_device_list"
                variant="outlined"
              ></v-select>
            </template>
              </v-card>


            </perfect-scrollbar>
          </template>
          <template v-slot:title>
           {{ $t("settings.title1") }}
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              prepend-icon="mdi-content-save-alert-outline"
              variant="outlined"
              @click="save_config"
              style="margin-right: 10px"
            >
            {{ $t("settings.button1") }}
            </v-btn>

            <v-btn
              color="primary"
              prepend-icon="mdi-fire"
              variant="outlined"
              @click="run_model"
            >
            {{ $t("settings.button2") }}
            </v-btn>
            <v-dialog v-model="loading" :scrim="true" persistent width="auto">
              <v-card color="primary">
                <v-card-text>
                  Please stand by
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" xl="6" xxl="6">
        <v-row class="flex-0" dense>
          <v-col cols="12">
            <!-- Sales Card -->
            <v-card
              class="cardr"
              title="LoRA设置"
              prepend-icon="mdi-vector-link"
            >
              <template v-slot:text>

                <v-row align="center">
                      <v-col cols="4">

                      </v-col>
                      <v-col cols="4">
                        <v-chip  color="primary" label>
                                                  TODO: 未完成
                        </v-chip>
                      </v-col>
                      <v-col cols="4">

                      </v-col>
                    </v-row>
              </template>
              <v-card-actions> </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <!-- Activity Card -->
                <v-card
                  class="cardr"
                  title="智能配置"
                  prepend-icon="mdi-content-save-move-outline"
                >
                  <template v-slot:text>
                    <v-select
                      color="primary"
                      label="显存大小"
                      :items="[
                        '<8G',
                        '8G-12G',
                        '>12G',
                      ]"
                      variant="outlined"
                    ></v-select>
                    <v-select
                      color="primary"
                      label="模型大小"
                      :items="[
                        '0.4B',
                        '1.5B',
                        '3B',
                        '7B',
                      ]"
                      variant="outlined"
                    ></v-select>

                    <v-row>
                      <v-col cols="4">
                        <v-btn
                          color="primary"
                          variant="outlined"
                          style="width: 100%"
                        >
                          最好效果
                        </v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          color="primary"
                          variant="outlined"
                          style="width: 100%"
                        >
                          最快速度
                        </v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          color="primary"
                          variant="outlined"
                          style="width: 100%"
                        >
                          最小内存
                        </v-btn>
                      </v-col>
                    </v-row>
                                        <!--
                      居中显示文字
                    -->
                    <v-row align="center">
                      <v-col cols="4">

                      </v-col>
                      <v-col cols="4">
                        <v-chip  color="primary" label>
                                                  TODO: 未完成
                        </v-chip>
                      </v-col>
                      <v-col cols="4">

                      </v-col>
                    </v-row>
                  </template>
                </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.setcard {
  margin-top: 10px;
}

.cardl {
  height: calc(100vh - 104px);
}

.card1-area {
  height: calc(100vh - 180px);
  padding-top: 10px;
}

.card2-area {
  height: calc(100vh / 2 - 200px);

  .v-col {
    margin: 0;
    padding: 0;
  }
}

.cardr {
  height: calc(100vh / 2 - 56px);
}

.chip {
  margin: 10px;
}
</style>
