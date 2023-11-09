<template>
  <div
    v-if="html"
    class="text-[1.4em] -mt-1"
    :data-tip="tooltip"
    :class="{ 'tooltip tooltip-left': tooltip }"
  >
    {{ html }}
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ html?: string; tooltip?: string }>();
</script>

<style lang="scss"></style>
