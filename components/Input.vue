<template>
  <div class="form-control">
    <div class="items-center">
      <label
        class="label pb-1 pt-0"
        :class="{ 'sr-only': labelHidden }"
        :for="name"
        ><span v-text="label" />
        <span
          v-if="requiredValidity === false"
          class="text-warning italic text-xs -mb-4"
        >
          required</span
        >
      </label>

      <div class="flex items-center">
        <div class="w-full relative flex items-center">
          <!-- Icon: Named Slot -- front side of input -->
          <div class="ml-3 text-2xl absolute">
            <slot name="icon" />
          </div>
          <!-- Icon: Back side of Input -- clear input -->
          <div
            v-if="modelValue && type !== 'number' && type !== 'date'"
            class="mr-3 absolute right-0 tooltip opacity-50 hover:opacity-100"
            data-tip="Clear Input"
          >
            <span
              class="h-6 w-6 text-lg text-neutral-content hover:text-error cursor-pointer"
              >&#10005;</span
            >
          </div>
          <!-- SHOW IF TYPE == TEXT AREA -->
          <textarea
            v-if="type === 'textarea'"
            :name="name"
            :placeholder="placeholder"
            :id="`${name}_${type}`"
            :minlength="minlength"
            :value="modelValue"
            :rows="rows"
            class="textarea textarea-bordered w-full"
            :required="required"
            @input="inputValues"
            :class="{
              'pl-10': $slots.icon,
              'ring-error ring-1': validity ? validity.valid === false : false,
            }"
          />
          <!-- SHOE IF TYPE == SELECT -->
          <select
            v-else-if="type === 'select'"
            class="select select-bordered w-full capitalize text-base"
            :required="required"
          >
            <option selected value="0" disabled v-text="`Select a ${label}`" />
            <option
              v-for="(opt, optk) in filteredList"
              :key="`${name}opt${optk}`"
              :value="opt.value"
              v-text="opt.label"
              class="capitalize"
            />
          </select>
          <!-- ALL STANDARD INPUTS -->
          <input
            v-else
            :type="type"
            :name="name"
            :id="`${name}_${type}`"
            :placeholder="placeholder"
            class="input input-bordered w-full text-base"
            :class="{
              range: type === 'range',
              'pl-10': $slots.icon,
              'ring-error ring-1': validity ? validity.valid === false : false,
            }"
            :required="required"
            :minlength="minlength"
            :max="max"
            :min="min"
            :step="step"
            :disabled="disabled"
            :pattern="patterns[type] || undefined"
            :value="modelValue"
            v-model="modelValue"
            :autocomplete="autocomplete || 'off'"
            @input="inputValues"
            @keyup.enter="$emit('submit')"
          />

          <div
            v-if="type === 'range'"
            class="w-full flex justify-between text-xs px-2"
          >
            <span>0</span>
            <span>{{ mid || "?" }}</span>
            <span>{{ mid ? mid * 2 : "?" }}</span>
            <span>{{ mid ? mid * 3 : "?" }}</span>
            <span>{{ mid ? mid * 4 : "?" }}</span>
          </div>
        </div>
        <!-- action icons to the right of the input -- provides a dirty feeling -->
        <div class="text-2xl"></div>
      </div>
      <!-- Email Format Error Message -->
      <div
        v-if="validity?.valid === false"
        class="text-error italic text-xs text-right"
      >
        {{ validity?.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

defineEmits(["submit"]);
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  labelHidden: Boolean,
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator(v: string) {
      return [
        "text",
        "password",
        "number",
        "range",
        "date",
        "email",
        "search",
        "url",
        "tel",
        "textarea",
        "select",
      ].includes(v);
    },
  },
  placeholder: String,
  required: Boolean,
  minlength: Number,
  maxlength: Number,
  max: Number,
  min: Number,
  step: Number,
  mid: Number,
  value: [Number, String],
  disabled: Boolean,
  data: {
    required: false,
    type: Array,
  },
  sorted: {
    required: false,
    type: Boolean,
  },
  autocomplete: {
    type: String,
    required: false,
    validator(v: string) {
      return [
        "off",
        "on",
        "name",
        "given-name",
        "additional-name",
        "family-name",
        "email",
        "username",
        "new-password",
        "current-password",
        "one-time-code",
        "organization",
        "street-address",
        "address-level1",
        "address-level2",
        "address-line1",
        "country-name",
        "postal-code",
        "cc-name",
        "cc-number",
        "cc-exp",
        "cc-csc",
        "bday",
        "tel",
        "tel-national",
        "url",
      ].includes(v);
    },
  },
  retype: {
    type: Boolean,
    required: false,
    default: true,
  },
  rows: Number,
  alpha: Boolean,
  alphanumeric: Boolean,
});

const validity = ref(null);

onMounted(async () => {
  const currentElement = document.getElementById(`${props.name}_${props.type}`);
  const formName = currentElement?.closest("form")?.id;
  validity.value = await useGetFormState(formName);
  if (validity.value?.value?.length) modelValue = validity.value.value;
});

// true: required field is filled, false: required field is empty
const requiredValidity = computed(() => {
  if (props.required === false) return true;
  if (
    modelValue.value !== "" &&
    modelValue.value !== null &&
    modelValue.value !== undefined &&
    modelValue.value !== 0
  ) {
    return true;
  } else return false;
});

// v-model
const modelValue: string | number = defineModel();

const inputValues = useDebounceFn(async (e: InputEvent) => {
  const fieldHTMLValidity = e.target.validity;
  const currentElement = document.getElementById(`${props.name}_${props.type}`);
  const formName = currentElement?.closest("form")?.id;
  if (formName) {
    validity.value = await useCheckValidity({
      formName,
      fieldName: props.name,
      fieldValue: e.target.value,
      fieldHTMLValidity,
      fieldType: props.type,
      alpha: props.alpha,
      alphanumeric: props.alphanumeric,
      min: props.min,
      max: props.max,
    });
  }
}, 375);

/** Sorts by data.value if sort boolean is true */
const filteredList = computed(() => {
  const arr = props.data;
  let filtered = [];

  if (props.sorted) {
    filtered = arr.sort((a, b) => {
      const x = a.label.toLowerCase();
      const y = b.label.toLowerCase();
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });
  } else {
    filtered = arr;
  }
  return filtered;
});

const patterns = {
  phone:
    /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
};

defineExpose({ validity, requiredValidity });
</script>
<style>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}
input:user-invalid,
textarea:user-invalid {
  @apply invalid:ring-1 invalid:ring-error;
}
</style>
