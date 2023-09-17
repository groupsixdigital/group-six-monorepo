<template>
  <div class="form-control">
    <label class="label pb-1" :for="name"
      ><span v-text="label" />
      <span v-if="required && !data" class="text-warning italic text-xs -mb-4">
        required</span
      ></label
    >

    <div class="w-full">
      <textarea
        :placeholder="placeholder"
        class="textarea textarea-bordered w-full invalid:border-error"
        :minlength="minlength"
        :value="modelValue"
        :rows="rows"
        @input="$emit('update:modelValue', $event.target.value)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { string } from 'valibot';
defineProps<{
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  value?: number;
  modelValue: any;
  rows: number;
}>();
defineEmits(["update:modelValue"]);

</script>
