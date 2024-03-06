<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import InputArea from "./InputArea.vue";
import MessageArea from "./MessageArea.vue";
import ChatTitle from "./ChatTitle.vue";
import { useChatStore } from "../chatStore";
import * as htmlToImage from "html-to-image";
import * as ai00Type from "@/ai00sdk/ai00Type";

import { watch, nextTick } from "vue";

const goClipboard = async () => {
  const element = document.getElementById("po");
  if (element) {
    const blob = await htmlToImage.toBlob(element, {
      cacheBust: true,
      skipFonts: true,
      skipAutoScale: true,
      backgroundColor: "#f8f8f8",
    });
    if (blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
    }
  }
};
const chatStore = useChatStore();
const target = ref();

// scroll to bottom
const scrollToBottom = () => {
  const chatArea = document.getElementById("chat-area");

  setTimeout(function () {
    chatArea?.scrollTo({
      top: chatArea?.scrollHeight,
    });
  }, 100);
};

const scrollToBottom2 = () => {
  const chatArea = document.getElementById("chat-area");
  target.value.update();

  chatArea?.scrollTo({
    top: chatArea?.scrollHeight,
  });
};

const settings = () => {
  chatStore.setSettings();
};

// scroll to top
const scrollToTop = () => {
  const chatArea = document.getElementById("chat-area");
  chatArea?.scrollTo({
    top: 0,
  });
};

const clear = () => {
  scrollToTop();
  chatStore.clearHistory();
  setTimeout(() => {
    scrollToTop();
  }, 500);
};

watch(
  () => chatStore.getnowchat,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

//监视chatStone.getLatestMessage()的变化，如果有变化，就滚动到底部
watch(
  () => chatStore.getLatestMessage(),
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";
import { InteractionManager } from "@pixi/interaction";
import { useWindowSize } from "@vueuse/core";
import { HitAreaFrames } from 'pixi-live2d-display/extra';

const Model = reactive({});

const { width } = useWindowSize();

onMounted(async () => {
  const app = new PIXI.Application({
    autoStart: true,
    backgroundAlpha: 0.3,
    resizeTo: document.getElementById("pixi-container"),
    autoDensity: true,
    backgroundColor: 0x333333,
  });
  //app.renderer.backgroundAlpha = 1; 
  const model = await Live2DModel.from("/cat/cat.model3.json");

  const scaleX = (innerWidth * 0.7) / model.width;
  const scaleY = (innerHeight * 0.7) / model.height;

  // fit the window
  model.scale.set(Math.min(scaleX, scaleY));
  model.y = -(innerHeight / 2) + 450;
  model.x = innerWidth / 2 - 1000;
  /*model.on("pointerdown", (hitAreas) => {
    console.log("Head", hitAreas);
  });*/



  model.on("hit", (hitAreas) => {
    console.log("body", hitAreas);
    if (hitAreas.includes("body")) {
      console.log("body", hitAreas);
    }

    if (hitAreas.includes("head")) {
      console.log("head", hitAreas);
    }
  });

  const displacementMap =
    "https://cdn.jsdelivr.net/gh/pixijs/pixi-filters/tools/demo/images/displacement_map.png";

  const baseRenderTexture = new PIXI.BaseRenderTexture({
    width: innerWidth,
    height: innerHeight,
  });
  const renderTexture = new PIXI.RenderTexture(baseRenderTexture);
  const sprite = new PIXI.Sprite(renderTexture);
  sprite.scale.set(2.5);

  sprite.x = -310;
  sprite.y = -510;
  sprite.alpha = 0.1;

  // set up filter

  const displacementSprite = PIXI.Sprite.from(displacementMap, {
    wrapMode: PIXI.WRAP_MODES.REPEAT,
  });

  app.ticker.add((dt) => {
    // animate the displacement map
    displacementSprite.x += dt * 10;

    // render on the render texture
    app.renderer.render(model, renderTexture);
  });

  app.stage.addChild(sprite);

  app.stage.addChild(model);
  addHitAreaFrames(model)
  //draggable(model);
 
  Model.value = await model;
  const pixiContainer = document.getElementById("pixi-container");
  pixiContainer.appendChild(app.view);
});

onBeforeMount(() => {
  PIXI.extensions.add(InteractionManager);
  window.PIXI = PIXI;
});

watch(width, (oldVal, newVal) => {
  calculateLocation(newVal);
});

let calculateLocation = (newVal) => {
  Model.value.y = -(innerHeight / 2) + 450;
  Model.value.x = innerWidth / 2 - 1000;

  console.log(Model.value.y, Model.value.x);
};

function draggable(model) {
  model.buttonMode = true;
  model.on("pointerdown", (e) => {
    model.dragging = true;
    model._pointerX = e.data.global.x - model.x;
    model._pointerY = e.data.global.y - model.y;
  });
  model.on("pointermove", (e) => {
    if (model.dragging) {
      model.position.x = e.data.global.x - model._pointerX;
      model.position.y = e.data.global.y - model._pointerY;
    }
  });
  model.on("pointerupoutside", () => (model.dragging = false));
  model.on("pointerup", () => (model.dragging = false));
}


function addHitAreaFrames(model) {
  const hitAreaFrames = new  HitAreaFrames();

  model.addChild(hitAreaFrames);

   hitAreaFrames.visible = false

   console.log(hitAreaFrames)
   hitAreaFrames.children.forEach(element => {
    element.interactive = true;//启用交互响应
    element.buttonMode = true;
    
   });
    
}



/*
import { VectorDB } from "idb-vector";
//创建数据库
const db = new VectorDB({
  vectorPath: "embedding",
});

//定义几个情感词
const contlist = ["happy",
"sad",
"angry",
"disgust",
"fear",
"surprise",
"neutral",
]

//对情感次列表依次量化并插入数据库
  contlist.forEach(bodys=>{
  const body: ai00Type.OaiEmbeddingsType = {
    input: bodys,
  }
  //向ai00 server 请求量化接口
    window.Ai00Api.oai_embeddings(body, async (res: any[]) => {
  //插入向量数据库
    db.insert({embedding: res.data[0].embedding, "text": bodys})
  })
})

//定义向量化查询的数据结构
const body: ai00Type.OaiEmbeddingsType = {
  input: "卧槽！AI00写得真牛逼！",
};

//向ai00 server 请求查询句子的量化数据
window.Ai00Api.oai_embeddings(body, async (res: any[]) => {
  //输出向量化搜索的前20条结果
  console.log(await db.query(res.data[0].embedding, { limit: 20 }));
  //拿到搜索结果后，重新组织提示词 再送入 ai00 server 进行LLM补全

});*/

 
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Header Area -->
  <!-- ---------------------------------------------- -->
  <v-toolbar class="bg-primary">
    <div class="mx-2 pa-1 flex-grow-1">
      <v-btn
        icon
        @click="chatStore.Sidebar = !chatStore.Sidebar"
        :title="!chatStore.Sidebar ? '显示工具栏' : '隐藏工具栏'"
      >
        <v-icon
          :icon="chatStore.Sidebar ? ' mdi-chevron-left' : ' mdi-chevron-right'"
        ></v-icon>
      </v-btn>
    </div>
    <template v-slot:append>
      <v-btn icon @click="goClipboard" title="Copy 对话图片到剪贴板">
        <v-icon>mdi-image-album</v-icon>
      </v-btn>
      <v-btn icon @click="settings" title="设置">
        <v-icon>mdi-tune-variant</v-icon>
      </v-btn>
    </template>
  </v-toolbar>

  <!-- ---------------------------------------------- -->
  <!---Chat Area -->
  <!-- ---------------------------------------------- -->

  <!-- ---------------------------------------------- -->
  <!---Message Area -->
  <!-- ---------------------------------------------- -->

  <v-sheet elevation="0" color="transparent" class="messages-area" id="po">
    <ChatTitle />
    <MessageArea />
  </v-sheet>
  <!-- ---------------------------------------------- -->
  <!---Input Area -->
  <!-- ---------------------------------------------- -->

  <v-sheet class="input-area">
    <InputArea @scroll="scrollToBottom2" />
  </v-sheet>
</template>

<style scoped lang="scss">
.messages-area {
  height: calc(100vh - 340px);
  background-color: #f8f8f8;

  margin-bottom: 20px;
  .input-area {
    position: fixed;
    width: 100%;
    height: 300px;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0);
  }
}
#pixi-container {
  position: absolute;
  z-index: 1000;
  top: 60px;

  width: 100%;
  height: calc(100vh - 320px);
  canvas {
    width: 100%;
    height: 100%;
  }
 
}
</style>
