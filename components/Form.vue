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

const formIsValid = computed(() => {
  let result = true;
  if (props.fields) {
    for (const field of props.fields) {
      if (field) {
        if (field?.validity === false || field?.requiredValidity === false)
          result = false;
        else result = true;
      }
    }
  }
  return result;
});

const formIsDirty = computed(() => {
  if (!props.fields) return false;
  return props.fields.map((x) => x.dirty).includes(true);
});

onNuxtReady(() => {
  if (process.env.NODE_ENV === "development" && !props.fields)
    console.warn(
      `FORM PROPS WARNING: No fields were provided to ${props.name} form for dirty tracking.`
    );
});
</script>
