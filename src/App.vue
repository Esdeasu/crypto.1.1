<template>
  <div class="h-full w-full flex flex-col items-left p-8 dark:bg-gray-900">
    <div class="w-full flex flex-row justify-between">
      <add-ticker
        @add-ticker="add"
        :disabled="toManyTickers"
        :added-tickers="tickersWithNoPrice"
      />
      <basic-button
        @butt-click="darkMode"
        :is-disabled="false"
        button-name="Сменить тему"
      />
    </div>
    <tickers-list
      v-if="tickers.length"
      @del-ticker="handleDelete"
      :get-tickers="tickers"
    />
    <selected-graph @delete-ticker="mainStore.selectedTicker = null" />
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "../src/api/api";
import { getCoins } from "./api/CoinsApi";
import { useMainStore } from "./store/newStore";
import { mapStores } from "pinia";
import { switchTheme } from "./composables/SwitchTheme";
import AddTicker from "../src/components/AddTicker.vue";
import SelectedGraph from "./components/SelectedGraph.vue";
import TickersList from "./components/TickersList.vue";
import BasicButton from "./atoms/BasicButton.vue";

export default {
  name: "App",
  components: {
    AddTicker,
    SelectedGraph,
    TickersList,
    BasicButton,
  },
  data() {
    return {
      tickers: [], //массив добавленных криптовалют
      coins: [], //массив с всеми возможными криптовалютами
    };
  },
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
    //Флаг превышения максимального числа добавленных тикеров
    toManyTickers() {
      return this.tickers.length > 18;
    },
  },
  methods: {
    darkMode() {
      switchTheme();
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
