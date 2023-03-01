import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    selectedTicker: null,
    graph: [],
    maxGraphEl: 1,
  }),
  getters: {},
  actions: {
    clearGraph() {
      this.graph = [];
    },
  },
});
