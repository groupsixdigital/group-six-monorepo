<template>
  <li
    class="cursor-pointer alert ring-1 ring-opacity-25"
    :class="{
      'ring-error': toast.type === 'error',
      'ring-success': toast.type === 'success',
      'ring-warning': toast.type === 'warning',
      'ring-info': toast.type === 'info',
    }"
    @click="close()"
  >
    <div class="avatar placeholder">
      <div
        class="rounded-full size-7"
        :class="{
          'bg-success': toast.type === 'success',
          'bg-warning': toast.type === 'warning',
          'bg-info': toast.type === 'info',
          'bg-error': toast.type === 'error',
        }"
      >
        <span
          v-if="toast.icon && toast.icon.match(/(&.+;)/gi)"
          class="text-xl text-black"
          v-html="toast.icon"
        />
      </div>
    </div>
    <span
      :class="{
        'text-error': toast.type === 'error',
        'text-success': toast.type === 'success',
        'text-warning': toast.type === 'warning',
        'text-info': toast.type === 'info',
      }"
      v-text="toast.message"
    />
    <button class="btn-sm btn">&#9587;</button>
  </li>
</template>

<script lang="ts" setup>
const props = defineProps(["toast"]);
const timer = ref(-1);
onMounted(() => {
  if (props.toast.autoClose) {
    timer.value = setTimeout(close, props.toast.duration * 1000);
  }
});
function close() {
  closeToast(props.id);
}
</script>
