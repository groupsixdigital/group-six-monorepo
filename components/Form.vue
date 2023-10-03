<template>
  <form :id="`form_${name}`" :name="`form_${name}`" :action=action>
    <slot :valid="formIsValid" />
  </form>
</template>

<script setup lang="ts">
const props = defineProps({
  action: String,
  name: {
    type: String,
    required: true
  }
})
const globalFormValidity = getValidity() // ref from state
const formIsValid = computed(() => !globalFormValidity.value.has(`form_${props.name}`))
onBeforeUnmount(() => removeFormValidity()) // When destroying this form, remove all form data from validity state
</script>

<style scoped></style>
