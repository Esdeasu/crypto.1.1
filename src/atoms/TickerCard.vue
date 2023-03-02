<template>
  <div class="dark:border-2 dark:border-gray-500">
    <div
      :class="{
        'bg-red-100 dark:bg-red-900': singleTicker.price === '-',
        'dark:border-2': selTick === singleTicker,
      }"
      class="px-4 py-5 sm:p-6 text-center dark:bg-gray-700"
    >
      <dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-300">
        {{ singleTicker.name }} - USD
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
        {{ formatPrice(singleTicker.price) }}
      </dd>
    </div>
    <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
    <button
      @click.stop="deleteTicker(singleTicker)"
      class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-900 dark:hover:text-gray-600 dark:hover:opacity-100"
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="#718096"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        ></path>
      </svg>
      Удалить
    </button>
  </div>
</template>
<script>
export default {
  props: {
    //Получение тикера
    singleTicker: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    selTick: {
      type: Object,
    },
  },
  emits: {
    //Удаление тикера
    delTicker: null,
  },
  methods: {
    // Форматирование цены
    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    //Удаление тикера
    deleteTicker(ticker) {
      this.$emit("delTicker", ticker);
    },
  },
};
</script>
