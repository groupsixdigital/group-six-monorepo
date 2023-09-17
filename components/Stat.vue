<template>
  <div class="stats shadow">
    <div class="stat group">
      <div class="stat-title">{{ title }}</div>
      <div class="stat-value">
        {{ dollars ? useFilters().formatDollars(dollars) : value }}
      </div>
      <div class="stat-desc">
        {{ description }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  dollars?: number;
  value?: number;
  description?: string;
}>();
</script>
