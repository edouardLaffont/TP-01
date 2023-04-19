<template>
  <div class="container">
    <h1>Todolist</h1>
    <form @submit.prevent="addTask">
      <input type="text" v-model="task" placeholder="Add task" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <input
          type="checkbox"
          :id="index.toString()"
          :checked="task.done"
          @change="updateTask({ name: task.name, done: !task.done }, index)"
        />
        <label :for="index.toString()" :class="{ done: task.done }">{{
          task.name
        }}</label>
        <button @click="deleteTask(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, InjectionKey } from "vue";
import { Task, State } from "@/store";
import { useStore, Store } from "vuex";

export default defineComponent({
  name: "App",
  data() {
    return {
      task: "",
    };
  },
  computed: {
    tasks(): Task[] {
      return this.$store.getters.getTasks;
    },
  },
  methods: {
    addTask() {
      if (this.task) {
        const task: Task = { name: this.task, done: false };
        this.$store.dispatch("addTask", task);
        this.task = "";
      }
    },
    deleteTask(index: number) {
      this.$store.dispatch("deleteTask", index);
    },
    updateTask(task: Task, index: number) {
      this.$store.dispatch("updateTask", { task, index });
    },
  },
});

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
</script>

<style>
.done {
  text-decoration: line-through;
}
</style>
