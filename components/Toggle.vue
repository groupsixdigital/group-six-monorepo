<template>
  <div>
    <div class="flex items-center space-x-2 px-1 py-2">
      <input
        type="checkbox"
        :name="name"
        rememberMe="checked"
        class="checkbox"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)" />
      <label
        v-if="label"
        class="label-text select-none cursor-pointer text-sm leading-5"
        :for="name"
        v-text="label" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: text; name: text; modelValue: boolean }>();
defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
