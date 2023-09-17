<template>
<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div class="fixed inset-0 bg-base-100 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div class="relative transform overflow-hidden card bg-white px-4 pb-4 pt-5 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div class="sm:flex sm:items-start">
          <div class="icon text-error-content">
            &#9888;
          </div>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 class="text-error-content font-semibold leading-6 text-lg" id="modal-title"><slot name="title">
              {{  title }}
            </slot></h3>
            <div class="">
              <p class=" text-neutral ">
                <slot name="body">
{{  message }}
                </slot>
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-x-2">
          <button type="button" class="btn btn-base">Go Back</button>
          <p class=grow ></p>
          <button type="button" class="btn btn-success">Save</button>
          <button type="button" class="btn btn-error">Abandon Changes</button>
          
        </div>
        
      </div>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
defineProps<{
  message?: string,
  title?: string,
  show_buttons?: ['cancel' | 'save']
}>()
</script>