<template>
  <div>
    <div class="flex items-center space-x-2 px-1 py-2">
      <input
        type="checkbox"
        :name="name"
        rememberMe="checked"
        class="checkbox"
        
        v-model="modelValue"
         />
      <label
        v-if="label"
        class="label-text select-none cursor-pointer text-sm leading-5"
        :for="name"
        v-text="label" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; name: string; modelValue: boolean }>();
const emits = defineEmits(["update:modelValue"]);
const modelValue = defineModel();
</script>

<style scoped></style>
