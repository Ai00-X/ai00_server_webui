<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useTodoStore } from "../Store";
const todoStore = useTodoStore();
</script>

<template>
  <v-card height="100%" class="pa-3">
    <!-- ---------------------------------------------- -->
    <!-- Add Task Dialog -->
    <!-- ---------------------------------------------- -->

    <v-btn color="primary" block size="large" class="mb-3">AI00 TUDO</v-btn>

    <v-list nav class="mt-2 pa-0">
      <v-list-item
        prepend-icon="mdi-calendar-check"
        to="/demos/todo/main"
        active-class="text-primary"
        link
        title="Tasks"
      >
        <template v-slot:append>
          <v-badge
            color="primary"
            :content="todoStore.getTodoList.length"
            inline
          ></v-badge>
        </template>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-check"
        to="/demos/todo/completed"
        active-class="text-primary"
        link
        title="Completed"
      >
        <template v-slot:append>
          <v-badge
            color="primary"
            :content="todoStore.getCompletedTodos.length"
            inline
          ></v-badge>
        </template>
      </v-list-item>
    </v-list>
    <div class="pa-1 mt-2 text-overline text-grey">TODO Labels</div>
    <v-list nav class="mt-2 pa-0">
      <v-list-item
        v-for="label in todoStore.labels"
        active-class="text-primary"
        :to="`/demos/todo/label/${label.id}`"
        link
        :title="label.title"
        :key="label.id"
      >
        <template v-slot:prepend>
          <v-icon :color="label.color">mdi-label-outline </v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped lang="scss"></style>
