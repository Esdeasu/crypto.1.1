<template>
  <hr class="w-full border-t border-gray-600 my-2" />
  <div class="flex flex-row justify-between mb-2">
    <div class="flex flex-row">
      <div class="self-center mr-2 dark:text-gray-300">
        Страница: {{ page }}
      </div>
      <basic-button
        v-if="page > 1"
        @butt-click="page = page - 1"
        :is-disabled="false"
        button-name="Назад"
      />
      <basic-button
        v-if="hasNextPage"
        @butt-click="page = page + 1"
        :is-disabled="false"
        button-name="Вперед"
      />
    </div>
    <div class="flex flex-row h-full">
      <p class="mr-5 inline-flex items-center dark:text-white">
        Информационная панель
      </p>
      <basic-button
        @butt-click="openPopup"
        :is-disabled="false"
        button-name="Развернуть"
      />
    </div>
    <info-template ref="confirmationPopup">
      {{ $options.RANDOM_TEXT }}
      <template #actions="{ confirm }">
        Напишите
        <input
          :placeholder="$options.CONFIRMATION_TEXT"
          v-model="confirmation"
        />
        &nbsp;
        <basic-button
          @butt-click="confirm"
          :is-disabled="false"
          button-name="OK"
        />
      </template>
    </info-template>
  </div>
  <div class="dark:text-gray-300">
    Фильтр:
    <input
      v-model="filter"
      class="w-100 p-1 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
  <hr class="w-full border-t border-gray-600 my-2" />
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div
      v-for="t in paginatedTickers"
      :key="t.name"
      @click="selectTicker(t)"
      class="overflow-visible shadow rounded-md border-solid cursor-pointer"
    >
      <ticker-card
        @del-ticker="deleteTicker"
        :single-ticker="t"
        :sel-tick="mainStore.selectedTicker"
      />
    </div>
  </dl>
  <hr class="w-full border-t border-gray-600 my-4" />
</template>

<script>
import { mapStores } from "pinia";
import { useMainStore } from "../store/newStore";
import TickerCard from "../atoms/TickerCard.vue";
import BasicButton from "../atoms/BasicButton.vue";
import InfoTemplate from "../components/InfoTemplate.vue";

export default {
  components: {
    TickerCard,
    BasicButton,
    InfoTemplate,
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
      confirmation: "", //строка подтверждения для работы с модальным окном
    };
  },
  //Рандомный текст для передачи через слот
  RANDOM_TEXT:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  CONFIRMATION_TEXT: "OK", //Текст необходимый для выхода из модального окна

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
    //Проверка правильности введённого текста в модальном окне
    isConfirmationCorrect() {
      return this.confirmation === this.$options.CONFIRMATION_TEXT;
    },
  },
  methods: {
    // Открытие модального окна
    async openPopup() {
      this.confirmation = "";
      const popupResult = await this.$refs.confirmationPopup.open();
      if (popupResult) {
        alert("Confirmed!");
      }
    },
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
