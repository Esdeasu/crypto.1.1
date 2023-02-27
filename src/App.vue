<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container mx-auto flex flex-col items-center p-4">
    <div class="container" >
      <add-ticker
        @add-ticker="add"
        :disabled="toManyTickers"
        :added-tickers="tickersWithNoPrice"
      />
      <tickers-list
        v-if="tickers.length"
        @select-ticker="select"
        @del-ticker="handleDelete"
        :get-tickers="tickers"
      />
      <selected-graph
      @delete-ticker="selectedTicker=null"
      :selTicker="selectedTicker"
      :tickerGraph="graph"
      ref="graph"
      />
      <div class="flex flex-row h-fit">
        <p class="mr-5 inline-flex items-center">Информационная панель</p>
          <button
            @click="openPopup"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Развернуть
          </button>
      </div>
      <info-template
      ref="confirmationPopup"
      >
        {{ randomText }}
        <template #actions="{ confirm }">
          Напишите
          <input :placeholder="$options.CONFIRMATION_TEXT" v-model="confirmation" />
          &nbsp;
          <button @click="confirm" :disabled="!isConfirmationCorrect">OK</button>
        </template>
      </info-template>
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "../src/api/api";
import { getCoins } from "./api/CoinsApi";
import AddTicker from "../src/components/AddTicker.vue";
import SelectedGraph from "./components/SelectedGraph.vue";
import InfoTemplate from "../src/components/InfoTemplate.vue";
import TickersList from "./components/TickersList.vue";

export default {
  name: "App",
  components: {
    AddTicker,
    SelectedGraph,
    InfoTemplate,
    TickersList,
  },
  data() {
    return {
      tickers: [], //массив добавленных криптовалют
      selectedTicker: null, //выбранная в данный момент криптовалюта
      graph: [], //график выбранной в данный моменткриптовалюты
      coins: [], //массив с всеми возможными криптовалютами
      maxGraphEl: 1, //колличество возможных столбцов в графе
      maxColumnWidth: 19, //ширина столбца в графе
      confirmation: "", //строка подтверждения для работы с модальным окном
    };
  },
  //Рандомный текст для передачи через слот
  RANDOM_TEXT:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  CONFIRMATION_TEXT: "OK", //Текст необходимый для выхода из модального окна

  mounted() {
    // Загрузка списка всех доступных криптовалют
    getCoins().then((value) => (this.coins = value));
    // Подписка на метод при изменении размеров окна браузера
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },
  beforeUnmount() {
    // Отписка на метод при изменении размеров окна браузера
    window.removeEventListener("resize", this.calculateMaxGraphElements);
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
    // Расчёт максимального числа столбцов в графе
    calculateMaxGraphElements() {
      if (!this.$refs.graph.$refs.graph) {
        return;
      }
      //this.maxColumnWidth = this.$refs.graphElWidth[0].clientWidth;
      this.maxGraphEl = this.$refs.graph.$refs.graph.clientWidth / 38;
    },
    // Работа с графом
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graph.push(price);
            while (this.graph.length > this.maxGraphEl) {
              this.graph.shift();
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
    //Выбор криптовалюты
    select(ticker) {
      this.selectedTicker = ticker;
    },
    // Удаление крипты
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.name);
    },
  },
  watch: {
    //Обновление локального хранилища
    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },
    //При изменении выбранной крипты очищает график
    selectedTicker() {
      this.graph = [];
      this.$nextTick().then(this.calculateMaxGraphElements);
    },
  },
};
</script>
