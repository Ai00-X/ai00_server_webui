<script setup lang="ts">
const quant = ref(0);
const quantint = ref("None");
const quanttemp = ref(0);

const token_chunk_size = ref(128);
const max_batch = ref(16);
const modelName = ref("");
const modelName_state_tuned = ref("");
const modelName_lora = ref("");
const model_path = ref("");
const adapterlist = ref([]);
const embed_device_list = ref(["Cpu", "Gpu"]);
const selectItems = ref<string[]>([]);
const selectItems_state_tuned = ref<string[]>([]);
const selecedtItems_state_tuned = ref<string[]>([]);
const state_tuned = ref<any>([]);
const selectItems_lora = ref<string[]>([]);
const selecedtItems_lora = ref<string[]>([]);
const lora = ref<any>([]);
const adapterNmae = ref<string>("");
const precision = ref("Fp16");
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
  let modelNames = newModels.map((model: modelslist) => model.name);
  // 过滤modelNames中后缀不为.st或者.state_tuned的文件
  let modelNames0 = modelNames.filter(
    (name: string) => name.endsWith(".st") || name.endsWith(".prefab")
  );
  let modelNames1 = modelNames.filter((name: string) =>
    name.endsWith(".state")
  );
  let modelNames2 = modelNames.filter((name: string) => name.endsWith(".lora"));
  selectItems.value = modelNames0;
  modelName.value = modelNames0[0];
  selectItems_state_tuned.value = modelNames1;
  modelName_state_tuned.value = modelNames1[0];
  selectItems_lora.value = modelNames2;
  modelName_lora.value = modelNames2[0];
});

watch(modelName, (newModel: string) => {
  model_path.value = "assets/models/" + newModel;
  console.log(model_path.value);
});

//获取显卡设备列表
window.Ai00Api.adapters((res: any) => {
  console.log(res);
  //过滤不含包含Vulkan的显卡
  adapterlist.value = res.filter((item: any) => item.includes("Vulkan"));

  //adapterlist.value = res;
  adapterNmae.value = adapterlist.value[0];
  console.log(adapterNmae.value);
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
  } else {
    quanttemp.value = 0;
  }
});


watch(selecedtItems_state_tuned, (selecedModels: string[]) => {
  //循环selecedModels，将其前面添加路径“”asstes/models/”“”添加到state_tuned中
  //state_tuned的结构是{path:string, id :string}



  state_tuned.value = selecedModels.map((model: string) => {
  //id 是 “00000000-0000-0000-0000-000000000001”这样的自动生成，根据序号生成，确保最后一个“-”后面是12位的16进制数
  //path 是 “assets/models/” + model
    return {
      //id: "00000000-0000-0000-0000-" + (selectItems_state_tuned.value.indexOf(model)+1).toString().padStart(12,"0"),
      path: "assets/models/" + model,
    };

  });

  console.log(state_tuned.value);
});


watch(selecedtItems_lora, (selecedModels: string[]) => {
  //循环selecedModels，将其前面添加路径“”asstes/models/”“”添加到lora中
  //state_tuned的结构是{path:string, alpha:num}
  lora.value = selecedModels.map((model: string) => {
  //alpha 是 0.5这样的浮点数，根据序号生成，确保最后一个“-”后面是12位的16进制数
  //path 是 “assets/models/” + model
    return {
      alpha: 192,
      path: "assets/models/" + model,
    };


  });

  console.log(lora.value);
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
    max_batch: Number(max_batch.value),
    tokenizer_path: "assets/tokenizer/rwkv_vocab_v20230424.json",
    embed_device: embed_device.value,
    precision: precision.value,
    //如果lora不为空
    lora: lora.value,
    //如果state_tuned不为空
    state: state_tuned.value,

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
        <v-card
          class="cardl"
          :title="t('dashboard.title1')"
          prepend-icon="mdi-file-cabinet"
        >
          <template v-slot:text>
            <perfect-scrollbar ref="target" id="card1-area" class="card1-area">
              <v-select
                v-model="modelName"
                color="primary"
                :label="t('settings.subtitle1')"
                :items="selectItems"
                variant="outlined"
              ></v-select>

              <v-select
                v-model="adapterNmae"
                color="primary"
                :label="t('settings.subtitle2')"
                :items="adapterlist"
                variant="outlined"
              ></v-select>

              <v-card
                class="setcard"
                variant="outlined"
                title="precision"
                subtitle="Precision for intermediate tensors ( Fp16[faster] or Fp32[slower but better] ). "
              >
                <template v-slot:text>
                  <v-radio-group v-model="precision" inline>
                    <v-radio
                      label="Fp16"
                      value="Fp16"
                      color="primary"
                    ></v-radio>
                    <v-radio
                      label="Fp32"
                      value="Fp32"
                      color="primary"
                    ></v-radio>
                  </v-radio-group>
                </template>
              </v-card>
              <v-card
                class="setcard"
                variant="outlined"
                title="quant"
                subtitle="Quantization mode. This could be FP16 or INT8 or NF4."
              >
                <template v-slot:text>
                  <v-radio-group v-model="quantint" inline>
                    <v-radio
                      label="FP16"
                      value="None"
                      color="primary"
                    ></v-radio>
                    <v-radio
                      label="INT8"
                      value="Int8"
                      color="primary"
                    ></v-radio>
                    <v-radio label="NF4" value="NF4" color="primary"></v-radio>
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
                title="embed_device"
                subtitle="The embedding device."
              >
                <template v-slot:text>
                  <v-select
                    v-model="embed_device"
                    color="primary"
                    :label="t('settings.subtitle2')"
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
            <!--
            <v-btn
              color="primary"
              prepend-icon="mdi-content-save-alert-outline"
              variant="outlined"
              @click="save_config"
              style="margin-right: 10px"
            >
              {{ $t("settings.button1") }}
            </v-btn>
          -->
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
      <v-col cols="6">
        <v-row class="flex-0" dense>
          <v-col cols="12">
            <!-- Sales Card -->
            <v-card
              class="cardr"
              title="State-Tuned & LoRA"
              prepend-icon="mdi-vector-link"
            >
              <template v-slot:text>
                <perfect-scrollbar ref="target" id="card1-area" class="card1-area">
                <v-card
                  class="setcard"
                  variant="outlined"
                  title="State-Tuned"
                  subtitle="The state-tuned model."
                >
                  <template v-slot:text>
                    <v-combobox
                      v-model="selecedtItems_state_tuned"
                      :items="selectItems_state_tuned"
                      label="select state-tuned model"
                      multiple
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          :key="JSON.stringify(data.item)"
                          v-bind="data.attrs"
                          :disabled="data.disabled"
                          :model-value="data.selected"
                          size="small"
                          @click:close="data.parent.selectItem(data.item)"
                        >
                          <template v-slot:prepend>
                            <v-avatar class="bg-accent text-uppercase" start>{{
                              data.item.title.slice(0, 1)
                            }}</v-avatar>
                          </template>
                          {{ data.item.title }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </template>
                </v-card>
                <v-spacer></v-spacer>
                <v-card
                  class="setcard"
                  variant="outlined"
                  title="LoRA"
                  subtitle="The LoRA model."
                >
                  <template v-slot:text>
                    <v-combobox
                      v-model="selecedtItems_lora"
                      :items="selectItems_lora"
                      label="select LoRA model"
                      multiple
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          :key="JSON.stringify(data.item)"
                          v-bind="data.attrs"
                          :disabled="data.disabled"
                          :model-value="data.selected"
                          size="small"
                          @click:close="data.parent.selectItem(data.item)"
                        >
                          <template v-slot:prepend>
                            <v-avatar class="bg-accent text-uppercase" start>{{
                              data.item.title.slice(0, 1)
                            }}</v-avatar>
                          </template>
                          {{ data.item.title }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </template>
                </v-card>

                </perfect-scrollbar>
              </template>
              <v-card-actions> </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <!-- Activity Card -->
            <v-card
              class="cardr"
              title="Save quantized model as prefab"
              prepend-icon="mdi-content-save-move-outline"
            >
              <template v-slot:text>
                <v-row align="center">
                  <v-col cols="4"> </v-col>
                  <v-col cols="4">
                    <v-chip color="primary" label> TODO: 未完成 </v-chip>
                  </v-col>
                  <v-col cols="4"> </v-col>
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
