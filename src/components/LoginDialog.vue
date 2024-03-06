<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";



/*
import promptsZh from "@/data/ai/prompts-zh.json";
import promptsEn from "@/data/ai/prompts-en.json";
import promptsJa from "@/data/ai/prompts-ja.json";
const { current } = useLocale();  */
const authStore = useAuthStore();


const tabs = ref(0)
const tabs2 = ref(0)
const loading = ref(false)
const show1 = ref(false)
const load = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 3000)
}
const showCard1 = ref(true)
const agree = ref(false)
const loginDialogPosition = ref(0);
const moveLoginDialog = () => {
  loginDialogPosition.value = 500;
  setTimeout(() => {
    showCard1.value = !showCard1.value; // Change this value to move the dialog to the desired position

  }, 500);


};
const moveLoginDialog2 = () => {
  loginDialogPosition.value = 0;
  setTimeout(() => {
    showCard1.value = !showCard1.value; // Change this value to move the dialog to the desired position

  }, 500);


};
/*
const promptList = computed(() => {
  if (current.value === "zhHans") {
    return promptsZh;
  }
  if (current.value === "en") {
    return promptsEn;
  }
  if (current.value === "ja") {
    return promptsJa;
  }
});  */
</script>

<template>
  <v-dialog v-model="authStore.configDialog">
    <v-sheet v-if="authStore.configDialog" class="loginbk" color="primary">
      <div class="login-bk-text">

        <div class="text-h4 pa-2"><v-icon>mdi-account</v-icon> 欢迎回来</div>
        <div style="height: 230px;overflow: scroll;overflow-x: hidden;overflow-y:auto;">
          <div class="text-body-1 pa-2">
            &nbsp;&nbsp;&nbsp;&nbsp;“AI00 智能助手”是基于AI00 Server开发的免费AI工具集。使用您的“AI00账户”登录，即可以享受完整服务。
          </div>
        </div>
        <div style="text-align: center;margin-top: 20px;">
          <v-btn color="#fff" style="color: black;" @click="moveLoginDialog">
            {{ $t("login.nopass") }}
          </v-btn>
        </div>

      </div>

      <div class="login-bk-text2">
        <div class="text-h4 pa-2"><v-icon>mdi-account-outline</v-icon> 欢迎加入</div>
        <div style="height: 230px;overflow: scroll;overflow-x: hidden;overflow-y:auto;">
          <div class="text-body-1 pa-2">
            &nbsp;&nbsp;&nbsp;&nbsp;“AI00 智能助手”是基于AI00 Server开发的免费AI工具集。注册您的“AI00账户”并登录，即可以享受完整服务。
          </div>
        </div>

        <div style="text-align: center;margin-top: 20px;">
          <v-btn color="#fff" style="color: black;" @click="moveLoginDialog2">
            已经拥有账户，立即登录
          </v-btn>
        </div>

      </div>

    </v-sheet>

    <!-- login Card -->
    <v-card class="logindl1" :style="{ transform: `translateX(${loginDialogPosition}px)` }" v-show="showCard1">

      <v-toolbar color="transparent" class="px-0">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ $t("login.title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs v-model="tabs" color="primary" grow>
            <v-tab :value="0">
              <v-icon>mdi-lock</v-icon>{{ $t("login.model2") }}
            </v-tab>
            <v-tab :value="1">
              <v-icon>mdi-email</v-icon>{{ $t("login.model1") }}
            </v-tab>


          </v-tabs>
        </template>
      </v-toolbar>

      <v-window v-model="tabs">
        <v-window-item :key="0" :value="0">
          <v-card class="lh">
            <v-card-text>

              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.account")
              }}</v-label>

              <v-text-field density="compact" :placeholder="$t('login.user')" prepend-inner-icon="mdi-account-outline"
                variant="outlined" color="primary" class="px-2 py-1" clearable></v-text-field>

              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.password")
              }}</v-label>

              <v-text-field :append-inner-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'" :type="show1 ? 'text' : 'password'"
                density="compact" :placeholder="$t('login.password')" prepend-inner-icon="mdi-lock-outline"
                variant="outlined" @click:append-inner="show1 = !show1" color="primary" class="px-2 py-1"
                clearable></v-text-field>

              <v-checkbox v-model="agree" :label="$t('login.agree')" required color="primary"
                style="padding-top: 90px;"></v-checkbox>

            </v-card-text>
            <v-divider color="primary" class="border-opacity-100"></v-divider>
            <v-card-actions>
              <v-btn color="primary" variant="elevated" :loading="loading" class="flex-grow-1 loginbtn" height="50"
                @click="load">
                {{ $t("login.button") }}
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-window-item>

        <v-window-item :key="1" :value="1">
          <v-card class="lh">
            <v-card-text>
              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.email")
              }}</v-label>

              <v-text-field density="compact" :placeholder="$t('login.email')" prepend-inner-icon="mdi-account-outline"
                variant="outlined" color="primary" class="px-2 py-1" clearable>

                <template v-slot:append>
                    <v-tooltip text="Tooltip"  location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn  v-bind="props" color="primary"   loading="true">
                          <v-icon icon="mdi-menu" start></v-icon>
                          获取验证码
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>
              </v-text-field>

              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.code")
              }}</v-label>

              <v-otp-input></v-otp-input>


              <v-checkbox v-model="agree" :label="$t('login.agree')" required color="primary"
                style="padding-top: 90px;"></v-checkbox>

            </v-card-text>
            <v-divider color="primary" class="border-opacity-100"></v-divider>
            <v-card-actions>

              <v-btn color="primary" variant="elevated" :loading="loading" class="flex-grow-1 loginbtn" height="50"
                @click="load">
                {{ $t("login.button") }}
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- register Card -->


    <v-card class="logindl2" :style="{ transform: `translateX(${loginDialogPosition}px)` }" v-show="!showCard1">

      <v-toolbar color="transparent" class="px-0">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ $t("register.title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs v-model="tabs2" color="primary" grow>
            <v-tab :value="2">
              <v-icon>mdi-badge-account-horizontal</v-icon>{{ $t("register.title") }}
            </v-tab>
            <v-tab :value="3">
              <v-icon>mdi-bookshelf</v-icon>{{ $t("register.rule") }}
            </v-tab>


          </v-tabs>
        </template>
      </v-toolbar>

      <v-window v-model="tabs2">
        <v-window-item :key="2" :value="2">
          <v-card class="lh">
            <v-card-text>

              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.account")
              }}</v-label>

              <v-text-field density="compact" :placeholder="$t('login.user')" prepend-inner-icon="mdi-account-outline"
                variant="outlined" color="primary" class="px-2 py-1" clearable></v-text-field>

              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.password")
              }}</v-label>

              <v-text-field :append-inner-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'" :type="show1 ? 'text' : 'password'"
                density="compact" placeholder="Enter youraa password" prepend-inner-icon="mdi-lock-outline"
                variant="outlined" @click:append-inner="show1 = !show1" color="primary" class="px-2 py-1"
                clearable></v-text-field>

              <v-checkbox v-model="agree" :label="$t('login.agree')" required color="primary"
                style="padding-top: 90px;"></v-checkbox>

            </v-card-text>
            <v-divider color="primary" class="border-opacity-100"></v-divider>
            <v-card-actions>
              <v-btn color="primary" variant="elevated" :loading="loading" class="flex-grow-1 loginbtn" height="50"
                @click="load">
                {{ $t("register.button") }}
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-window-item>

        <v-window-item :key="3" :value="3">
          <v-card class="lh">
            <v-card-text>
              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.account")
              }}</v-label>
              <v-text-field color="primary" variant="outlined" class="px-2 py-1" :placeholder="$t('login.user')"
                prepend-inner-icon="mdi-email" clearable>
              </v-text-field>

              <v-label class="font-weight-medium mb-2 ml-2 mt-5">{{
                $t("login.code")
              }}</v-label>

              <v-text-field color="primary" variant="outlined" class="px-2 py-1" :placeholder="$t('login.code')"
                prepend-inner-icon="mdi-lock" clearable type="password">
              </v-text-field>


              <v-checkbox :label="$t('login.agree')" required color="primary" style="padding-top: 62px;"></v-checkbox>

            </v-card-text>
            <v-divider color="primary" class="border-opacity-100"></v-divider>
            <v-card-actions>
              <v-spacer><v-label class="mb- ml-2 mt-5"> 忘记密码 </v-label></v-spacer>

              <v-spacer></v-spacer>
              <v-btn color="primary" variant="elevated" :loading="loading" class="flex-grow-1 loginbtn" height="50"
                @click="load">
                {{ $t("login.button") }}
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.loginbk {

  width: 1100px;
  max-width: 1280px;
  height: 450px;
  position: fixed; // 使用绝对定位
  top: 50%; // 从顶部开始的位置设为50%
  left: 50%; // 从左边开始的位置设为50%
  transform: translate(-50%, -50%); // 使用transform来居中元素
  z-index: 1999; // 将z-index设为1，使其在dialog下面

  .login-bk-text {
    padding: 45px;

    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 50%; // Set width to 50% of parent
  }

  .login-bk-text2 {
    padding: 45px;

    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 50%; // Set width to 50% of parent
  }
}

.logindl1 {
  width: 500px;
  max-width: 600px;
  height: 670px;
  position: absolute; // 使用绝对定位
  top: calc(50% - 335px); // 从顶部开始的位置设为50%
  left: calc(50% - 500px); // 从左边开始的位置设为50%并且偏左200px
  transform: translateY(-50%); // 使用transform来垂直居中元素
  z-index: 2000; // 将z-index设为2000，使其在.loginbk上面

  transition: transform 0.3s ease-out;
}

.logindl2 {
  width: 500px;
  max-width: 600px;
  height: 670px;
  position: absolute; // 使用绝对定位
  top: calc(50% - 335px); // 从顶部开始的位置设为50%
  left: calc(50% - 500px); // 从左边开始的位置设为50%并且偏左200px
  transform: translateY(-50%); // 使用transform来垂直居中元素
  z-index: 2000; // 将z-index设为2000，使其在.loginbk上面

  transition: transform 0.3s ease-out;
}

.loginbtn {
  margin-top: 40px;
}
</style>

