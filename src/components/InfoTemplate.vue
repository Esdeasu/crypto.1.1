<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/[0.8] z-[100]"
    @click="confirm"
  >
    <div
      class="p-12 top-50 left-1/2 translate-y-full -translate-x-2/4 fixed z-[101] bg-white text-black dark:bg-gray-800 dark:text-white rounded-xl"
      @click.stop
    >
      <h1 class="m-0 text-center">Внимание!</h1>
      <hr />
      <slot></slot>
      <hr />
      <div class="text-right">
        <slot name="actions" :confirm="confirm">
          <button @click="confirm">Ok</button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  popupController: null,
  data() {
    return {
      isOpen: false, //Флаг состояния модального окна
    };
  },
  mounted() {
    //Подписка на отслеживание нажатия кнопки
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    //Отписка на отслеживание нажатия кнопки
    document.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    //Вызывает метод закрытия модального окна при нажатии на Escape
    handleKeydown(e) {
      if (this.isOpen && e.key === "Escape") {
        this.close();
      }
    },
    open() {
      let resolve;
      let reject;
      const popupPromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });
      this.$options.popupController = { resolve, reject };
      this.isOpen = true;
      return popupPromise;
    },
    confirm() {
      this.$options.popupController.resolve(true);
      this.isOpen = false;
    },
    close() {
      this.$options.popupController.resolve(false);
      this.isOpen = false;
    },
  },
};
</script>