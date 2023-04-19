<template>
  <div class="container">
    <h1>Todolist</h1>
    <p>Tasks in progress: {{ inProgressTasks }}</p>
    <p>Completed tasks: {{ completedTasks }}</p>
    <form @submit.prevent="addTask">
      <label for="task">Task:</label>
      <input
        type="text"
        v-model="task"
        id="task"
        placeholder="Add task"
        required
      />

      <label for="hours">Hours:</label>
      <input
        type="text"
        v-model.number="hours"
        id="hours"
        placeholder="Add number of hours"
        required
      />

      <label for="responsible">Responsible:</label>
      <select v-model="responsible" id="responsible" required>
        <option v-for="r in responsibles" :key="r.name" :value="r.name">
          {{ r.name }}
        </option>
      </select>

      <button type="submit" :disabled="!isFormValid">Add</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
    <ul>
      <div>
        <button @click="showInProgressTasks = !showInProgressTasks">
          {{ showInProgressTasks ? "Hide" : "Show" }} in progress tasks
        </button>
        <button @click="showCompletedTasks = !showCompletedTasks">
          {{ showCompletedTasks ? "Hide" : "Show" }} completed tasks
        </button>
      </div>
      <li v-for="(task, index) in filteredTasks" :key="index">
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
          >{{ task.name }} - {{ task.responsible.name }}</label
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
      task: "",
      hours: 0,
      responsible: "",
      responsibles: [
        { name: "Sylvanas", tasks: [] },
        { name: "Arthas", tasks: [] },
        { name: "Nefarian", tasks: [] },
      ],
      errorMessage: "",
      showCompletedTasks: true,
      showInProgressTasks: true,
    };
  },
  computed: {
    tasks(): Task[] {
      return this.$store.getters.getTasks;
    },
    isFormValid(): boolean {
      return this.validateForm();
    },
    inProgressTasks(): number {
      return this.tasks.filter((task) => !task.done).length;
    },
    completedTasks(): number {
      return this.tasks.filter((task) => task.done).length;
    },
    filteredTasks(): Task[] {
      let tasks = this.tasks;
      if (!this.showInProgressTasks) {
        tasks = tasks.filter((task) => task.done);
      }
      if (!this.showCompletedTasks) {
        tasks = tasks.filter((task) => !task.done);
      }
      return tasks;
    },
  },
  methods: {
    addTask() {
      if (this.validateForm()) {
        const responsibleObj = this.responsibles.find(
          (r) => r.name === this.responsible
        );
        const task: Task = {
          name: this.task,
          done: false,
          hours: this.hours,
          responsible: {
            name: responsibleObj?.name,
            tasks: responsibleObj?.tasks,
          },
        };
        this.$store.dispatch("addTask", task);
        this.task = "";
        this.hours = 0;
        this.responsible = "";
      }
    },
    deleteTask(index: number) {
      this.$store.dispatch("deleteTask", index);
    },
    updateTask(updatedTask: Task, index: number) {
      this.$store.dispatch("updateTask", { task: updatedTask, index });
    },
    validateForm() {
      if (!this.task || !this.responsible || !this.hours) {
        this.errorMessage = "All fields are required";
        return false;
      } else if (isNaN(this.hours) || this.hours <= 0) {
        this.errorMessage = "Hours should be a positive number";
        return false;
      } else {
        this.errorMessage = "";
        return true;
      }
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
