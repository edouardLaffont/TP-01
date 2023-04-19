import { createStore } from "vuex";

export interface Task {
  name: string;
  done: boolean;
}

export interface State {
  tasks: Task[];
}

export default createStore<State>({
  state: {
    tasks: [],
  },
  mutations: {
    addTask(state, task: Task) {
      state.tasks.push(task);
    },
    deleteTask(state, index: number) {
      state.tasks.splice(index, 1);
    },
    updateTask(state, payload: { index: number; task: Task }) {
      state.tasks[payload.index] = payload.task;
    },
  },
  actions: {
    addTask({ commit }, task: Task) {
      commit("addTask", task);
    },
    deleteTask({ commit }, index: number) {
      commit("deleteTask", index);
    },
    updateTask({ commit }, payload: { index: number; task: Task }) {
      commit("updateTask", payload);
    },
  },
  getters: {
    getTasks: (state) => state.tasks,
  },
});
