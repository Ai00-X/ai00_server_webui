<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import TodoList from "../component/List.vue";
import { useTodoStore } from "../Store";

const todoStore = useTodoStore();
const route = useRoute();

watch(
  () => route.params.id,
  (id) => {
    todoStore.currentLabel = id as string;
  }
);
</script>

<template>
  <TodoList :tasks="todoStore.getLabelTodos" />
</template>

<style scoped lang="scss"></style>
