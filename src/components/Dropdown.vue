<template>
  <div class="flex items-center justify-center">
    <div class="relative">
      <div v-if="open" @click="open = false" class="fixed inset-0"></div>
      <button
        @click="open = !open"
        class="relative flex items-center focus:outline-none"
      >
        <slot name="title"></slot>
      </button>
      <transition
        enter-active-class="transition-all transition-fastest ease-out-quad"
        leave-active-class="transition-all transition-faster ease-in-quad"
        enter-class="opacity-0 scale-70"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-70"
      >
        <div
          v-if="open"
          class="origin-top-right absolute right-0 mt-2 w-64 bg-white rounded-lg border shadow-md py-2"
        >
          <ul>
            <li
              v-for="(option, index) in options"
              :key="index"
              @click="
                $emit('optionSelected', option.value);
                open = false;
              "
            >
              <a
                href="#"
                class="text-lg block px-4 py-2 hover:bg-indigo-500 hover:text-white"
                >{{ preOptionText }} {{ option.text }}</a
              >
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    preOptionText: {
      type: String
    }
  },
  data() {
    return {
      open: false
    };
  }
};
</script>
