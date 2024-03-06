<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import TodoList from "../component/List.vue";
import { useTodoStore } from "../Store";
const todoStore = useTodoStore();
</script>

<template>
  <TodoList :tasks="todoStore.getCompletedTodos" />
</template>

<style scoped lang="scss"></style>
