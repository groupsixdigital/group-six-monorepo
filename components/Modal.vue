<template>
  <dialog class="modal" :id="id">
    <form
      class="modal-box m-8 max-w-[95%]"
      method="dialog"
      :style="backgroundImage">
      <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
        ✕
      </button>
    </form>
    <form class="modal-backdrop" method="dialog">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  type: "image_preview";
  url?: string;
}>();
const backgroundImage = computed(() => {
  const previewImage = {
    "background-image": `url(http://localhost:54321/storage/v1/object/public/images/${props.url})`,
    "background-position": "center",
    "background-size": "contain",
    "height": "90%",
    "background-repeat": "no-repeat"
  };

  return props.type === "image_preview" ? previewImage : "";
});
</script>
