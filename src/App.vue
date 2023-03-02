<!-- eslint-disable prettier/prettier -->
<template>
    <div class="h-full w-full overflow-hidden flex flex-col items-left p-4 dark:bg-gray-900">
      <div class="w-full flex flex-row justify-between">
        <add-ticker
          @add-ticker="add"
          :disabled="toManyTickers"
          :added-tickers="tickersWithNoPrice"
        />
        <theme-button />
      </div>
      <tickers-list
        v-if="tickers.length"
        @del-ticker="handleDelete"
        :get-tickers="tickers"
      />
      <selected-graph @delete-ticker="mainStore.selectedTicker = null" />
      <div class="flex flex-row h-fit items-left">
        <p class="mr-5 inline-flex items-center dark:text-white">
          Информационная панель
        </p>
          <button
            @click="openPopup"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600"
          >
            Развернуть
          </button>
      </div>
      <info-template
      ref="confirmationPopup"
      >
        {{ $options.RANDOM_TEXT }}
        <template #actions="{ confirm }">
          Напишите
          <input :placeholder="$options.CONFIRMATION_TEXT" v-model="confirmation" />
          &nbsp;
          <button @click="confirm" :disabled="!isConfirmationCorrect">OK</button>
        </template>
      </info-template>
    </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "../src/api/api";
import { getCoins } from "./api/CoinsApi";
import { useMainStore } from "./store/newStore";
import { mapStores } from "pinia";
import AddTicker from "../src/components/AddTicker.vue";
import SelectedGraph from "./components/SelectedGraph.vue";
import InfoTemplate from "../src/components/InfoTemplate.vue";
import TickersList from "./components/TickersList.vue";
import ThemeButton from "./atoms/ThemeButton.vue";

export default {
  name: "App",
  components: {
    AddTicker,
    SelectedGraph,
    InfoTemplate,
    TickersList,
    ThemeButton,
  },
  data() {
    return {
      tickers: [], //массив добавленных криптовалют
      coins: [], //массив с всеми возможными криптовалютами
      confirmation: "", //строка подтверждения для работы с модальным окном
    };
  },
  //Рандомный текст для передачи через слот
  RANDOM_TEXT:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  CONFIRMATION_TEXT: "OK", //Текст необходимый для выхода из модального окна
  beforeMount() {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
  mounted() {
    // Загрузка списка всех доступных криптовалют
    getCoins().then((value) => (this.coins = value));
  },
  created() {
    //Загрузка добавленных тикеров из локального хранилища
    const tickersData = localStorage.getItem("cryptonomicon-list");
    // Подписка добавленных тикеров на получени цены
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }
    //Обновление цены добавленных тикеров
    setInterval(this.updateTickers, 5000);
  },
  computed: {
    ...mapStores(useMainStore),
    //Список добавленных тикеров без цены
    tickersWithNoPrice() {
      const ticks = this.tickers.map((value) => {
        return value.name;
      });
      return ticks;
    },
    //Проверка правильности введённого текста в модальном окне
    isConfirmationCorrect() {
      return this.confirmation === this.$options.CONFIRMATION_TEXT;
    },
    //Флаг превышения максимального числа добавленных тикеров
    toManyTickers() {
      return this.tickers.length > 18;
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
    // Работа с графом
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.mainStore.selectedTicker) {
            this.mainStore.graph.push(price);
            while (this.mainStore.graph.length > this.mainStore.maxGraphEl) {
              this.mainStore.graph.shift();
            }
          }
          t.price = price;
        });
    },
    // Добавление новой криптовалюты
    add(ticker) {
      const currentTicker = {
        name: ticker,
        price: "-",
      };
      this.tickers = [...this.tickers, currentTicker];
      this.filter = "";
      subscribeToTicker(currentTicker.name, (newPrice) =>
        this.updateTicker(currentTicker.name, newPrice)
      );
    },
    // Удаление крипты
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.mainStore.selectedTicker === tickerToRemove) {
        this.mainStore.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.name);
    },
  },
  watch: {
    //Обновление локального хранилища
    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },
  },
};
</script>
