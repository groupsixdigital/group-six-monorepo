<template>
  <form :id="`form_${name}`" :name="`form_${name}`" :action="action">
    <slot :valid="valid" :dirty="dirty" :requiredValidity="requiredValidity" />
  </form>
</template>

<script setup lang="ts">
const props = defineProps({
  action: String,
  name: {
    type: String,
    required: true,
    default: () => Math.random().toString(36).substring(4),
  },
  fields: Array,
});

const formState = computed(() => useGetFormState(props.name));
const valid = computed(() => {
  let arr = new Set();
  formState?.value?.forEach((x: ValidStatisType) => arr.add(x.valid));
  return !arr.has(false);
});
const dirty = computed(() => {
  let arr = new Set();
  formState.value?.forEach((x: ValidStatisType) => arr.add(x.dirty));
  return arr.has(true);
});
const requiredValidity = computed(() => {
  let arr = new Set();
  formState.value?.forEach((x: ValidStatisType) => arr.add(x.required));
  return !arr.has(false);
});

interface ValidStatisType {
  valid: boolean;
  dirty: boolean;
  required: boolean;
  message: string;
  value: string;
}
</script>
