<script setup>
import { useMainStore } from "../store/newStore";
import { watch, computed, onUpdated, onUnmounted, ref, nextTick } from "vue";

const emit = defineEmits(["deleteTicker"]);
const main = useMainStore();
const graphWidth = ref({});

onUpdated(() => {
  // Подписка на метод при изменении размеров окна браузера
  window.addEventListener("resize", calculateMaxGraphElements());
});

onUnmounted(() => {
  // Отписка на метод при изменении размеров окна браузера
  window.removeEventListener("resize", calculateMaxGraphElements());
});

// Настройка отображения графика
const normalizedGraph = computed(() => {
  const maxValue = Math.max(...main.graph);
  const minValue = Math.min(...main.graph);

  if (maxValue === minValue) {
    return main.graph.map(() => 50);
  }
  return main.graph.map(
    (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
  );
});

//Отмена выбранного тикера
function deleteTicker() {
  emit("deleteTicker");
}
//Расчёт максимального количества столбцов в графе
function calculateMaxGraphElements() {
  if (!graphWidth.value || !graphWidth.value.clientWidth) {
    return;
  }
  //this.maxColumnWidth = this.$refs.graphElWidth[0].clientWidth;
  main.maxGraphEl = graphWidth.value.clientWidth / 38;
}

// Очищает график при смене выбранного тикера
watch(
  () => main.selectedTicker,
  () => {
    main.clearGraph();
    nextTick(() => calculateMaxGraphElements());
  }
);
</script>

<template>
  <section v-if="main.selectedTicker">
    <div class="flex flex-row justify-between">
      <h3
        class="text-lg leading-6 font-medium text-gray-900 my-2 dark:text-gray-200"
      >
        {{ main.selectedTicker.name }} - USD
      </h3>
      <button @click="deleteTicker" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.com/svgjs"
          version="1.1"
          width="30"
          height="30"
          x="0"
          y="0"
          viewBox="0 0 511.76 511.76"
          style="enable-background: new 0 0 512 512"
          xml:space="preserve"
        >
          <g>
            <path
              d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
              fill="#718096"
              data-original="#000000"
            ></path>
          </g>
        </svg>
      </button>
    </div>
    <div
      class="flex items-end border-gray-600 border-b border-l h-56"
      ref="graphWidth"
    >
      <div
        v-for="(bar, idx) in normalizedGraph"
        :key="idx"
        :style="{ height: `${bar}%` }"
        ref="graphElWidth"
        class="bg-gray-600 border w-10 dark:bg-gray-300 dark:border-gray-800"
      ></div>
    </div>
  </section>
</template>
