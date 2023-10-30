<template>
  <form :id="`form_${name}`" :name="`form_${name}`" :action="action">
    <slot :valid="formIsValid" :dirty="formIsDirty" />
  </form>
</template>

<script setup lang="ts">
const props = defineProps({
  action: String,
  name: {
    type: String,
    required: true,
  },
  fields: Array<FieldsType>,
});

interface FieldsType {
  validity: boolean;
  requiredValidity: boolean;
  dirty: boolean;
}

const formIsValid = ref(true);
const formIsDirty = ref(false);
</script>
