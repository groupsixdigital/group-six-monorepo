<template>
  <div class="form-control">
    <label class="label pb-1" :for="name"
      ><span v-text="label" />
      <span v-if="required && !data" class="text-error italic text-xs -mb-4">
        required</span
      ></label
    >
    <div class="w-full relative">
      <div class="ml-3 text-2xl absolute -translate-y-1/2 top-1/2">
        <slot name="icon" />
      </div>
      <select
        class="select select-bordered w-full capitalize"
        :required="required"
      >
        <option value="0" disabled v-text="`Select from ${label}`"></option>
        <option
          v-for="(opt, optk) in filteredList"
          :key="`${name}opt${optk}`"
          :value="opt.value"
          v-text="opt.label"
          class="capitalize"
        />
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StdListItem } from "~~/types/types";
const props = defineProps<{
  label?: string;
  name: string;
  required?: boolean;
  data: StdListItem[];
  sorted?: boolean;
}>();

/** Sorts by data.value if sort boolean is true */
const filteredList = computed(() => {
  const arr = props.data;
  let filtered = [];

  if (props.sorted) {
    filtered = arr.sort((a, b) => {
      const x = a.label.toLowerCase();
      const y = b.label.toLowerCase();
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });
  } else {
    filtered = arr;
  }
  return filtered;
});
</script>

<style scoped></style>
