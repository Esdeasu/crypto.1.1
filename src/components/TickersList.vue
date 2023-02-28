<template>
  <hr class="w-full border-t border-gray-600 my-4" />
  <div class="flex flex-row mb-2">
    <div class="self-center">Страница: {{ page }}</div>
    <button
      class="self-center mx-5 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      v-if="page > 1"
      @click="page = page - 1"
    >
      Назад
    </button>
    <button
      class="self-center mx-5 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      @click="page = page + 1"
      v-if="hasNextPage"
    >
      Вперед
    </button>
  </div>
  <div class="h-fit self-center">Фильтр: <input v-model="filter" /></div>
  <hr class="w-full border-t border-gray-600 my-4" />
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
      v-for="t in paginatedTickers"
      :key="t.name"
      @click="selectTicker(t)"
      :class="{
        'border-4': mainStore.selectedTicker === t,
        //'bg-red-100': mainStore.selectedTicker.price === '-',
      }"
      class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
    >
      <ticker-card @del-ticker="deleteTicker" :single-ticker="t" />
    </div>
  </dl>
  <hr class="w-full border-t border-gray-600 my-4" />
</template>

<script>
import { mapStores } from "pinia";
import TickerCard from "../atoms/TickerCard.vue";
import { useMainStore } from "../store/newStore";

export default {
  components: {
    TickerCard,
  },
  props: {
    //Список добавленных криптовалют
    getTickers: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  emits: {
    //Удаление тикера
    delTicker: null,
  },
  data() {
    return {
      filter: "", //Строка фильтра
      page: 1, //Текущая страница списка тикеров
    };
  },
  created() {
    //Установка значений фильтра и страницы при загрузке
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    if (windowData.filter) {
      this.filter = windowData.filter;
    }
    if (typeof windowData.page === "number") {
      this.page = windowData.page;
    }
  },
  computed: {
    ...mapStores(useMainStore),
    //Форматирование цены криптовалюты
    formatPrice(price) {
      if (typeof price !== "number") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    //Определение стартового значения страницы для вывода тикеров
    startIndex() {
      return (this.page - 1) * 6;
    },
    //Определение конечного значения страницы для вывода тикеров
    endIndex() {
      return this.page * 6;
    },
    //Фильтрация списка тикеров отноительно фильтра
    filteredTickers() {
      return this.getTickers.filter((ticker) =>
        ticker.name.includes(this.filter)
      );
    },
    //Вывод отфильтрованного списка тикеров
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
    //Проверка на наличие следующей страницы в списке тикеров
    hasNextPage() {
      return this.getTickers.length > this.endIndex;
    },
    // Состояние фильтров и страницы
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  methods: {
    //Удаление тикера
    deleteTicker(t) {
      this.$emit("delTicker", t);
    },
    //Делает активным выбранный тикер
    selectTicker(t) {
      this.mainStore.selectedTicker = t;
    },
  },
  watch: {
    // Переходит на предыдущую страницу если на странице не осталось криптовалют
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    // Обновление ссылки при изменении фильтра
    filter() {
      this.page = 1;
    },
    // Обновление ссылки при переключении между страницами
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
  },
};
</script>
