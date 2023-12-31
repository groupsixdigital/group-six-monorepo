<template>
  <Teleport to="body">
    <div name="Alert Toast" class="toast">
      <transition-group name="toast" tag="ul" class="space-y-2">
        <TheToastInstance
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
        />
      </transition-group>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
const toasts = getToasts();
</script>
<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
