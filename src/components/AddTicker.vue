<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label
          for="wallet"
          class="block text-sm font-medium text-gray-700 dark:text-white"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            :disabled="disabled"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Например DOGE"
          />
        </div>
        <label v-if="warning" class="block text-sm font-medium text-red-700">
          Данной криптовалюты не существует или она уже добавлена
        </label>
        <label v-if="disabled" class="block text-sm font-medium text-red-700">
          Добавлено максимальное количество криптовалют
        </label>
      </div>
    </div>
    <add-button @add-tick="add" :disabled="disabled" />
  </section>
</template>

<script>
import AddButton from "../atoms/AddButton.vue";
import { getCoins } from "../api/CoinsApi.js";

export default {
  components: {
    AddButton,
  },

  props: {
    // Состояние активности кнопки
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Список добавленных криптовалют
    addedTickers: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },

  emits: {
    //Добавление тикера
    addTicker: (value) => typeof value === "string" && value.length > 0,
  },

  data() {
    return {
      ticker: "", //Название криптовалюты
      coins: [], //Список всех доступных криптовалют
      warning: false, //Флаг для вывода уведомления о невозможности довабить криптовалюту
    };
  },
  mounted() {
    //Получение всех доступных для добавления криптовалют
    getCoins().then((value) => (this.coins = value));
  },
  methods: {
    //Проверка возможности добавления криптовалюты и добавление криптовалюты
    add() {
      if (
        this.coins.includes(this.ticker) &&
        !this.addedTickers.includes(this.ticker)
      ) {
        this.$emit("addTicker", this.ticker);
        this.ticker = "";
        this.warning = false;
      } else {
        this.warning = true;
      }
    },
  },
  watch: {
    //Убирает предупреждение если строка пуста
    ticker() {
      if (this.ticker === "") {
        this.warning = false;
      }
    },
  },
};
</script>
