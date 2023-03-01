<template>
  <button
    @click="$emit('addTick')"
    type="button"
    :disabled="disabled"
    class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:border-gray-600"
    :class="{ 'opacity=50': disabled }"
  >
    Добавить
  </button>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    addTick: null,
  },
};
</script>
