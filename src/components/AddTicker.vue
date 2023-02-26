<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <label
          v-if="warning"
          for="wallet"
          class="block text-sm font-medium text-red-700"
          >Данной криптовалюты не существует или она уже добавлена</label
        >
      </div>
    </div>
    <add-button @add-tick="add" :disabled="disabled" />
  </section>
</template>

<script>
import AddButton from "../components/AddButton.vue";
import { getCoins } from "../api/CoinsApi.js";

export default {
  components: {
    AddButton,
  },

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    addedTickers: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },

  emits: {
    addTicker: (value) => typeof value === "string" && value.length > 0,
  },

  data() {
    return {
      ticker: "",
      coins: [],
      warning: false,
    };
  },
  mounted() {
    getCoins().then((value) => (this.coins = value));
  },
  methods: {
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
};
</script>
