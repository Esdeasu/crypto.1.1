<script setup>
defineProps({
  isDisabled: Boolean,
  buttonName: String,
});

const emit = defineEmits(["buttClick"]);
</script>

<template>
  <button
    @click="emit('buttClick')"
    type="button"
    :disabled="isDisabled"
    :class="{ 'opacity=50': isDisabled }"
    class="h-10 my-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:hover:text-white"
  >
    {{ buttonName }}
  </button>
</template>
