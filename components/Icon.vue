<template>
  <div v-if="html" class="text-[1.4em] -mt-1">{{ html }}</div>
  <div><slot /></div>
</template>

<script setup lang="ts">
defineProps<{ html?: string }>();
</script>

<style lang="scss"></style>
