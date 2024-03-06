<script setup lang="ts">


</script>
<template>
  <div class="pa-5">
    <!-- ---------------------------------------------- -->
    <!---First Row -->
    <!-- ---------------------------------------------- -->
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="12">
        <!-- Sales Card -->
        <v-card class="card-shadow"  >
          <v-card-title class="text-center">{{ $t("dashboard.about") }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="12" md="4" xl="4">
                <v-card class="minicard">
                  <v-card-title class="text-center">{{ $t("dashboard.title1") }}</v-card-title>
                  <v-card-text class="minitext">{{ $t("dashboard.text1")}}</v-card-text>
                </v-card>
                
              </v-col>
              <v-col cols="12" sm="12" md="4" xl="4">
                <v-card class="minicard">
                  <v-card-title class="text-center">{{ $t("dashboard.title2") }}</v-card-title>
                  <v-card-text class="minitext">{{ $t("dashboard.text2")}}</v-card-text>
                </v-card>
                
              </v-col>
              <v-col cols="12" sm="12" md="4" xl="4">
                <v-card class="minicard">
                  <v-card-title class="text-center">{{ $t("dashboard.title3") }}</v-card-title>
                  <v-card-text class="minitext">{{ $t("dashboard.text3")}}</v-card-text>
                </v-card>
                
              </v-col>
            </v-row>
          </v-card-text>

        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" xl="6">
        <!-- Activity Card -->
        <v-card class="card-shadow" height="420">
          Coming Soon
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" xl="6">
        <!-- Trafiic Card-->
        <v-card class="card-shadow h-full" height="420">
          Coming Soon
        </v-card>
      </v-col>
    </v-row>
    <!-- ---------------------------------------------- -->
    <!---Second Row -->
    <!-- ---------------------------------------------- -->

  </div>
</template>
<style lang="scss" scoped>
.minicard{
  height: 100%;
 
  .minitext{
    font-size: 18px;
    line-height: 1.5;
    margin-top: 10px;
    text-indent: 2em;
  }
}
</style>
