<script setup lang="ts">
import * as ai00Type from "@/ai00sdk/ai00Type";

const quant = ref(0);
const quantint = ref("None");
const quanttemp = ref(0);

const token_chunk_size = ref(128);
const max_batch = ref(16);
const modelName = ref("");
const modelName_state_tuned = ref("");
const modelName_lora = ref("");
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

const isprefab = ref(false);
interface modelslist {
  name: string;
  size: string;
  sha: string;
  info: any;
}

interface Loaded_model_info {
  quant: number;
  quant_type: string;
  Vesion: string;
  Params: string;
  modelname: string;
}

const models = ref<modelslist[]>([]);
const loading = ref(false);
const maxquant = ref(31);
const Loaded_model = ref<Loaded_model_info>({
  quant: 0,
  quant_type: "",
  Vesion: "",
  Params: "",
  modelname:"",
});

//获取模型列表
window.Ai00Api.models_list((res: Array<modelslist>) => {
  console.log(res);
  models.value = res;
});

function model_info() {
  window.Ai00Api.models_info((res: any) => {
    console.log("1222", res);
    //Loaded_model.value.modelname 取 res.reload.model_path 最后一个/或者\后面的字符串



    let modelname = res.reload.model_path.split("/").pop().split("\\").pop().split(".")[0];

    Loaded_model.value.modelname = modelname;
    Loaded_model.value.quant = res.reload.quant;
    Loaded_model.value.quant_type = res.reload.quant_type;
    Loaded_model.value.Vesion = res.model.version;
    let newModel = res.reload.model_path;
    if (newModel.includes("-1B") || newModel.includes("-1b")) {
      Loaded_model.value.Params = "1B";
    } else if (newModel.includes("-3B") || newModel.includes("-3b")) {
      Loaded_model.value.Params = "3B";
    } else if (newModel.includes("-7B") || newModel.includes("-7b")) {
      Loaded_model.value.Params = "7B";
    } else if (newModel.includes("-14B") || newModel.includes("-14b")) {
      Loaded_model.value.Params = "14B";
    } else {
      Loaded_model.value.Params = "unkown";
    }
  });
}

model_info();

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

const modelB = ref("unkown");

watch(modelName, (newModel: string) => {

  //根据modelname 找到对应的模型信息，并更新maxquant的值
  let modelInfo = models.value.find((model: modelslist) => model.name === newModel);
  if (modelInfo && modelInfo.info) {
  console.log("modelInfo", maxquant.value);
  maxquant.value = modelInfo.info.num_layer - 1;
}


  if (newModel.includes("1B") || newModel.includes("1b") || newModel.includes("1.5b") || newModel.includes("1.5B")) {
    modelB.value = "1B";
  } else if (newModel.includes("3B") || newModel.includes("3b")) {
    modelB.value = "3B";
  } else if (newModel.includes("7B") || newModel.includes("7b")) {
    modelB.value = "7B";
  } else if (newModel.includes("14B") || newModel.includes("14b")) {
    modelB.value = "14B";
  } else {
    modelB.value = "unkown";
  }

  let modelNames = models.value.map((model: modelslist) => model.name);
  // Now you can continue with your filtering or other operations
  //确保name中包含 modelB 并且 endwith 。state
  let modelNames1 = modelNames.filter(
    (name: string) => name.includes(modelB.value) && name.endsWith(".state")
  );

  //let modelNames1 = modelNames.filter((name: string) => name.endsWith(".state"));
  //let modelNames2 = modelNames.filter((name: string) => name.endsWith(".lora"));

  let modelNames2 = modelNames.filter(
    (name: string) => name.includes(modelB.value) && name.endsWith(".lora")
  );

  selectItems_state_tuned.value = modelNames1;
  modelName_state_tuned.value = modelNames1[0];
  selecedtItems_state_tuned.value = [];
  selectItems_lora.value = modelNames2;
  modelName_lora.value = modelNames2[0];
  selecedtItems_lora.value = [];

  if (newModel.endsWith(".prefab")) {
    isprefab.value = true;
  }else{
    isprefab.value = false;
  }

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
      path: model,
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
      path: model,
    };
  });

  console.log(lora.value);
});

async function  save_prefab() {
  //todo
  loading.value = true;
  let prefabname = Loaded_model.value.modelname + "-" + Loaded_model.value.quant_type + "_" + Loaded_model.value.quant + "-" + new Date().getTime() + ".prefab";
  let body: ai00Type.ModelSaveType = {
    model_path:prefabname
  }

await window.Ai00Api.models_save(body, async (res: string) => {
  loading.value = false;
      });
}

function run_model() {
  loading.value = true;
  //调用Ai00API 的models_load 函数 启动模型
  //1. 先初始化 models_load 的参数
  const adapterpost = {
    Manual: adapter.value,
  };
  const model_load_params = {
    model_path: modelName.value,
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
    model_info();
  });
}

const isInputDisabled = ref(false);
function inputdown(value) {
  isInputDisabled.value = true;
}

function inputup(value) {
  isInputDisabled.value = false;
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
                :disabled="isprefab"
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
                    :max="maxquant"
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
                <perfect-scrollbar
                  ref="target"
                  id="card1-area"
                  class="card1-area"
                >
                  <v-card
                    class="setcard"
                    variant="outlined"
                    title="Intial State"
                    subtitle="The file extension must be .state"
                  >
                    <template v-slot:text>
                      <v-combobox
                        v-model="selecedtItems_state_tuned"
                        :items="selectItems_state_tuned"
                        label="Select state-tuned model"
                        multiple
                        variant="outlined"
                        clearable
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
                              <v-avatar
                                class="bg-accent text-uppercase"
                                start
                                >{{ data.item.title.slice(0, 1) }}</v-avatar
                              >
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
                    subtitle="The file extension must be .lora"
                  >
                    <template v-slot:text>
                      <v-combobox
                        v-model="selecedtItems_lora"
                        :items="selectItems_lora"
                        label="Select LoRA model"
                        multiple
                        variant="outlined"
                        @keydown="inputdown"
                        @keyup="inputup"
                        :disabled="isInputDisabled"
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
                              <v-avatar
                                class="bg-accent text-uppercase"
                                start
                                >{{ data.item.title.slice(0, 1) }}</v-avatar
                              >
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
                <v-card
                  class="setcard"
                  variant="outlined"
                  title="Loaded model info"
                  subtitle="The file extension must be .lora"
                >
                  <template v-slot:text>
                    <v-row align="center">
                      <v-col cols="2" align="center">
                        <v-chip color="primary" label> Name </v-chip>
                      </v-col>
                      <v-col cols="4" align="left">
                        {{ Loaded_model.modelname }}
                      </v-col>

                      <v-col cols="2" align="center">
                        <v-chip color="primary" label> Params </v-chip>
                      </v-col>
                      <v-col cols="4" align="left">
                        {{ Loaded_model.Params }}
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="2" align="center">
                        <v-chip color="primary" label> Vesion </v-chip>
                      </v-col>
                      <v-col cols="4" align="left">
                        {{ Loaded_model.Vesion }}
                      </v-col>

                      <v-col cols="2" align="center">
                        <v-chip color="primary" label> Quant </v-chip>
                      </v-col>
                      <v-col cols="4" align="left">
                        {{ Loaded_model.quant_type }}_{{ Loaded_model.quant }}
                      </v-col>
                    </v-row>
                  </template>
                  <v-card-actions>
                    <v-row align="center">
                      <v-col cols="4" align="center"> </v-col>
                      <v-col cols="4" align="center">
                        <v-btn
                          color="primary"
                          prepend-icon="mdi-fire"
                          variant="outlined"
                          @click="save_prefab"
                        >
                          Save as prefab
                        </v-btn>
                      </v-col>
                      <v-col cols="4" align="center"> </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
#input-49 {
  display: none !important;
}

.setcard {
  margin-top: 10px;
  input {
    display: none !important;
  }
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
