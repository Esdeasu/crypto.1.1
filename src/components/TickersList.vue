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
        'border-4': selTicker === t,
        'bg-red-100': t.price === '-',
      }"
      class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
    >
      <div class="px-4 py-5 sm:p-6 text-center">
        <dt class="text-sm font-medium text-gray-500 truncate">
          {{ t.name }} - USD
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ t.price }}
        </dd>
      </div>
      <div class="w-full border-t border-gray-200"></div>
      <button
        @click.stop="deleteTicker(t)"
        class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
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
  </dl>
  <hr class="w-full border-t border-gray-600 my-4" />
</template>

<script>
export default {
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
    //Делает активным выбранный тикер
    selectTicker: null,
  },
  data() {
    return {
      filter: "", //Строка фильтра
      selTicker: null, //Текущий выбранный тикер
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
      this.selTicker = t;
      this.$emit("selectTicker", this.selTicker);
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
