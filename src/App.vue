<template>
  <div class="container">
    <h1>Todolist</h1>
    <form @submit.prevent="addTask">
      <input type="text" v-model="task.name" placeholder="Add task" />
      <input type="number" v-model="task.hours" placeholder="Hours" />
      <select v-model="task.responsible">
        <option value="">Select responsible</option>
        <option
          v-for="(responsible, index) in responsibles"
          :key="index"
          :value="responsible"
        >
          {{ responsible }}
        </option>
      </select>
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <input
          type="checkbox"
          :id="index.toString()"
          :checked="task.done"
          @change="
            updateTask(
              {
                name: task.name,
                done: !task.done,
                hours: task.hours,
                responsible: task.responsible,
              },
              index
            )
          "
        />
        <label :for="index.toString()" :class="{ done: task.done }"
          >{{ task.name }} - {{ task.hours }}h - {{ task.responsible }}</label
        >
        <button @click="deleteTask(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Task, State } from "@/store";
import { Store } from "vuex";

export default defineComponent({
  name: "App",
  data() {
    return {
      task: { name: "", done: false, hours: 0, responsible: "" },
      responsibles: ["Arthas", "Gromash", "Ner'zhul", "Sylvanas"],
    };
  },
  computed: {
    tasks(): Task[] {
      return this.$store.getters.getTasks;
    },
  },
  methods: {
    addTask() {
      if (this.task.name) {
        const task: Task = { ...this.task };
        this.$store.dispatch("addTask", task);
        this.task = { name: "", done: false, hours: 0, responsible: "" };
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
