<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { ChatListStore } from "../chatlistStore";
import { useChatStore } from "../chatStore";
import type { Message, clist } from "../chatTypes";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import "moment/dist/locale/es-us";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
moment.locale("zh-cn");

const getdiff = (timestamp) => {
  moment.locale("zh-cn");
  return moment(Number(timestamp)).fromNow();
};

const ChatList = ChatListStore();

const ChatStore = useChatStore();

const index = ref(0);
const idname = ref("");


const getUserName =  () => {

//百家姓
  const familyNames = new Array(
      "赵",  "钱",  "孙",  "李",  "周",  "吴",  "郑",  "王",  "冯",  "陈",  
      "褚",  "卫",  "蒋",  "沈",  "韩",  "杨",  "朱",  "秦",  "尤",  "许",
      "何",  "吕",  "施",  "张",  "孔",  "曹",  "严",  "华",  "金",  "魏",  
      "陶",  "姜",  "戚",  "谢",  "邹",  "喻",  "柏",  "水",  "窦",  "章",
      "云",  "苏",  "潘",  "葛",  "奚",  "范",  "彭",  "郎",  "鲁",  "韦",  
      "昌",  "马",  "苗",  "凤",  "花",  "方",  "俞",  "任",  "袁",  "柳",
      "酆",  "鲍",  "史",  "唐",  "费",  "廉",  "岑",  "薛",  "雷",  "贺",  
      "倪",  "汤",  "滕",  "殷",  "罗",  "毕",  "郝",  "邬",  "安",  "常",
      "乐",  "于",  "时",  "傅",  "皮",  "卞",  "齐",  "康",  "伍",  "余",  
      "元",  "卜",  "顾",  "孟",  "平",  "黄",  "和",  "穆",  "萧",  "尹",
      "姚",  "邵",  "湛",  "汪",  "祁",  "毛",  "禹",  "狄",  "米",  "贝",
      "明",  "臧",  "计",  "伏",  "成",  "戴",  "谈",  "宋",  "茅",  "庞",
      "熊",  "纪",  "舒",  "屈",  "项",  "祝",  "董",  "梁",  "杜",  "阮",
      "欧阳", "司马", "上官", "欧阳", "夏侯", "诸葛", "闻人", "东方", "赫连", "皇甫",
      "尉迟", "公羊", "澹台", "公冶", "宗政", "濮阳", "淳于", "单于", "太叔", "申屠",
      "公孙", "仲孙", "轩辕", "令狐", "钟离", "宇文", "长孙", "慕容", "司徒", "司空",
      );

  //名称
  const givenNames = new Array(
      "星辰", "美丽", "翔", "淑华", "晶莹", "云浩", "正气", "雨涵", "嘉怡", "佳毅", 
      "皓月", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡", 
      "子璇", "淼", "国栋", "夫子", "悦心", "甜", "敏", "尚", "国贤", "贺祥", "越峰", 
      "昊轩", "启悦", "皓然", "建国", "益冉", "瑾春", "月仙", "雅芬", "章章", "文昊", 
      "大东", "雄霖", "浩晨", "熙涵", "切瑞", "枫叶", "欣欣", "宜豪", "欣慧", "建业", 
      "建林", "亦菲", "皓轩", "冰洁", "佳欣", "涵涵", "月辰", "淳美", "恩铭", "伟洋", 
      "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌",
      "佳怡", "欧莱", "晨茜", "晨璐", "运昊", "梦欣", "淑君", "晶滢", "润莎", "榕汕", 
      "乐毅", "佳玉", "晓庆", "一鸣", "语晨", "添池", "田心", "雨泽", "雅晗", "雅涵", 
      "德华", "学友", "化腾", "正非", "正峰", "正豪", "正平", "正业", "正真", "子童",
      "子琪", "子真", "子濯", "自明", "自强", "作人", "自怡", "自珍", "曾琪", "泽宇",
      "泽语", "文轩", "文昊", "文华", "文康", "文乐", "文林", "文敏", "文瑞", "文山",
      "文石", "文星", "文轩", "文彦", "文曜", "文耀", "文斌", "文彬", "文滨", "向晨",
      "向笛", "向文", "向明", "向荣", "向阳", "翔宇", "翔飞", "项明", "项禹", "心水",
      "心思", "心远", "欣德", "欣嘉", "欣可", "欣然", "欣荣", "欣怡", "欣怿", "欣悦",
      "新翰", "新霁", "新觉", "新立", "新荣", "新知", "信鸿", "信厚", "信鸥", "信然",
  );
  
  //根据familyNames 的长度，得到随机数  0- familyNames 长度之间的随机数
  const i = parseInt(String(Math.random() * familyNames.length));
  //根据givenNames 的长度，得到随机数  0- givenNames 长度之间的随机数
  const j = parseInt(String(Math.random() * givenNames.length));
  //得到一个随机的姓氏
  const name = familyNames[i] + givenNames[j];
  return name
}

const newchat = () => {
  if (ChatStore.getChatting()) {
    return;
  }
  const idnames = Date.now().toString();


  const tounum = Math.round(Math.random() * 15);
  const name = getUserName();
  const bot = ref({
    id: 2,
    name: name,
    avatar: "/tou/" + tounum + ".png",
  });
  const newchatl: clist = {
    id_name: idnames,
    title: name,
    tou : "/tou/" + tounum + ".png",
    history: [],
  };
  ChatList.addToChatList(newchatl);

  index.value = ChatList.getListnum() - 1;

  ChatStore.setnowchat(idnames);
  idname.value = idnames;
  ChatStore.AIimg = "/tou/" + tounum + ".png";

  const hello: Message = {
    id: "_" + Math.random().toString(36).substring(2, 11),
    user: bot.value,
    text: t("chat.hello"),
    timestamp: new Date().getTime(),
  };
  ChatStore.startHistory(hello);

  const chatArea = document.getElementById("chat-area");

  chatArea?.scrollTo({
    top: 0,
  });
};

const change = (i: number) => {
  if (ChatStore.getChatting()) {
    return;
  }
  index.value = i;

  ChatStore.setnowchat(ChatList.getChatid(i).id_name);
  idname.value = ChatList.getChatid(i).id;
  const nowHistoy = ChatList.getChatid(i).history;

  ChatStore.setHistory(nowHistoy);
  if (ChatStore.chatHistory) {
    ChatStore.AIimg = ChatStore.chatHistory[0].user.avatar;
    ChatStore.AIname = ChatStore.chatHistory[0].user.name;
  }

  const chatArea = document.getElementById("chat-area");

chatArea?.scrollTo({
  top: 0,
});

setTimeout(() => {


chatArea?.scrollTo({
      top: chatArea?.scrollHeight,
    });
 
      }, 500);
};

const del = (id_name: string) => {
  if (ChatStore.getChatting()) {
    return;
  }

  let nowindex = index.value;
  let delindex: number = ChatList.getidbyname(id_name) ?? 0;
  console.log("noewchat:",ChatStore.getnowchat())
  console.log(id_name)
  ChatList.removeChatList(id_name);
  
if (ChatList.getListnum() == 0) {
  newchat();
} else if (id_name == ChatStore.getnowchat()) {
       change(0);
   }else{

    if(nowindex > delindex){
      index.value = index.value -1;
    }
   }
 
}
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- Add Task Dialog -->
  <!-- ---------------------------------------------- -->
  <v-btn color="primary" block class="mb-4 w-full" @click="newchat">
    {{ $t("chat.newchat") }}</v-btn
  >
  <perfect-scrollbar ref="target" id="chat-m" class="chat-m">
    <v-list nav class="mt-2 pa-0" color="primary">
      <v-list-item
        v-for="(item, indexs) of ChatList.ids"
        :key="item.id_name"
        class="newbtn"
        active-class="active-chat"
        :title="getdiff(item.id_name)"
        link
        :active="index === indexs"
        @click="change(indexs)"
      >
      <template v-slot:prepend>
        <v-avatar size="40" class="bg-primary"
     >
      <v-img  :src="item.tou" />
    </v-avatar>
        </template>
        <template #title>
          <v-card style="background-color: rgba(255, 255, 255, 0)">
            <template #title>
              <span style="font-size: 16px">{{ item.title }}</span>
            </template>
            <template #subtitle>
              <span style="font-size: 12px">{{ getdiff(item.id_name) }}</span>
            </template>
          </v-card>
        </template>
        <template v-slot:append>
          <v-btn
            variant="plain"
            size="x-small"
            icon="mdi-close"
            @click="del(item.id_name)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </perfect-scrollbar>
  <!-- <div class="pa-1 mt-2 text-overline text-grey">More Chats</div> -->
</template>

<style scoped lang="scss">
.active-chat {
  border-left: 5px solid;
  border-image-slice: 1;
}

.newbtn {
  overflow: hidden;
}

.chat-m {
  height: calc(100vh - 320px);
  margin-bottom: 20px;
}
</style>
