<!--
* @Component: ToolbarColor
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useTheme } from "vuetify";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import { Icon } from "@iconify/vue";
interface Color {
  colorId: number;
  colorName: string;
  colorValue: string;
}
const customizeTheme = useCustomizeThemeStore();
const theme = useTheme();
const currentColor = ref<Color>({
  colorId: 2,
  colorName: "grey",
  colorValue: "#344767",
});

onMounted(() => updatePrimaryColor(customizeTheme.primaryColor));

watch(currentColor.value, (newVal) => {
  updatePrimaryColor(newVal)
});

const updatePrimaryColor = (newColor: Color) => {
  theme.themes.value.light.colors.primary = newColor.colorValue;
  theme.themes.value.dark.colors.primary = newColor.colorValue;
  customizeTheme.setPrimaryColor(newColor);
 
}
</script>

<template>
  <v-menu location="bottom right" transition="slide-y-transition">
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" class="text-none">
 
          <v-icon color="primary">mdi-invert-colors</v-icon>
 
      </v-btn>
    </template>
    <v-list elevation="1" lines="three" density="compact" max-width="400">
      <v-list-subheader>Primary Color</v-list-subheader>
      <v-list-item>
      <v-color-picker
        v-model="currentColor.colorValue"
      hide-inputs
      show-swatches
    ></v-color-picker>
</v-list-item>
      <!-- ---------------------------------------------- -->
      <!-- See all Btn-->
      <!-- ---------------------------------------------- -->
      <div class="text-center py-5">
        <v-btn size="small" variant="elevated" elevation="1"> See all </v-btn>
      </div>
    </v-list>
  </v-menu>
</template>

<style scoped lang="scss">
// ::v-deep .v-list-item__append,
// ::v-deep .v-list-item__prepend {
//   height: 100%;
// }
</style>
