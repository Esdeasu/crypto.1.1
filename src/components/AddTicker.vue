<script setup>
import BasicButton from "../atoms/BasicButton.vue";
import { getCoins } from "../api/CoinsApi.js";
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  // Состояние активности кнопки
  disabled: Boolean,
  // Список добавленных криптовалют
  addedTickers: Array,
});

const emit = defineEmits(["addTicker"]);

const ticker = ref(""); //Название криптовалюты
const coins = ref([]); //Список всех доступных криптовалют
const warning = ref(false); //Флаг для вывода уведомления о невозможности довабить криптовалюту

onMounted(() => {
  //Получение всех доступных для добавления криптовалют
  getCoins().then((value) => (coins.value = value));
});

//Проверка возможности добавления криптовалюты и добавление криптовалюты
function add() {
  if (
    coins.value.includes(ticker.value) &&
    !props.addedTickers.includes(ticker.value)
  ) {
    emit("addTicker", ticker.value);
    ticker.value = "";
    warning.value = false;
  } else {
    warning.value = true;
  }
}
watch(
  () => ticker,
  () => {
    if (ticker.value === "") {
      warning.value = false;
    }
  }
);
</script>

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
    <basic-button
      @butt-click="add"
      :is-disabled="false"
      button-name="Добавить"
    />
  </section>
</template>
