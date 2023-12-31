<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="form-control">
    <div class="items-center" :class="{ 'mt-4': labelFloat }">
      <label
        class="pt-0 pb-1"
        :class="[
          { 'sr-only': labelHidden },
          labelFloat ? 'floated-label flex gap-4' : 'label',
        ]"
        :for="name"
        ><span v-text="label" />
        <span v-if="maxlength" class="text-xs"
          ><span
            :class="{
              'text-error':
                typeof modelValue === 'string' &&
                modelValue?.length > maxlength,
            }"
            v-text="typeof modelValue === 'string' ? modelValue.length : 0"
          />
          / {{ maxlength }}</span
        >
        <span
          v-if="requiredValidity === false"
          class="-mb-4 text-xs italic text-warning"
        >
          required</span
        >
      </label>

      <div class="flex items-center gap-1">
        <div class="relative flex items-center w-full">
          <!-- Icon: Named Slot -- front side of input -->
          <div class="absolute ml-3 text-2xl">
            <slot name="icon" />
          </div>
          <!-- Icon: Back side of Input -- clear input -->
          <div
            v-if="
              modelValue && type !== 'number' && type !== 'date' && !disabled
            "
            class="absolute right-0 mr-3 opacity-50 tooltip tooltip-left hover:opacity-100"
            data-tip="Clear Input"
            @click="
              typeof modelValue === 'number'
                ? (modelValue = 0)
                : (modelValue = '')
            "
          >
            <span
              class="w-6 h-6 text-lg cursor-pointer text-neutral-content hover:text-error"
              >&#10005;</span
            >
          </div>
          <!-- SHOW IF TYPE == TEXTAREA -->
          <textarea
            v-if="type === 'textarea'"
            :id="`${name}_${type}`"
            v-model="modelValue"
            :name="name"
            :placeholder="placeholder"
            :minlength="minlength"
            :rows="rows"
            class="w-full textarea textarea-bordered"
            :required="required"
            v-bind="$attrs"
            :class="{
              'pl-10': $slots.icon,
              'ring-error ring-1': inputState
                ? inputState.valid === false
                : false,
            }"
            @input="inputValues"
          />
          <!-- SHOW IF TYPE == SELECT -->
          <select
            v-else-if="type === 'select'"
            class="w-full text-base capitalize select select-bordered"
            v-bind="$attrs"
            :required="required"
          >
            <option selected value="0" disabled v-text="`Select a ${label}`" />
            <option
              v-for="(opt, optk) in filteredList"
              :key="`${name}opt${optk}`"
              :value="opt.value"
              class="capitalize"
              v-text="opt.label"
            />
          </select>
          <!-- ALL STANDARD INPUTS -->
          <input
            v-else
            :id="`${name}_${type}`"
            v-model="modelValue"
            :type="type"
            :name="name"
            v-bind="$attrs"
            :placeholder="placeholder"
            class="w-full text-base input input-bordered placeholder:text-base-content/40 placeholder:italic"
            :class="[
              {
                range: type === 'range',
                'pl-10': $slots.icon,
                'ring-error ring-1': inputState
                  ? inputState.valid === false
                  : false,
              },
              size === 'lg'
                ? 'input-lg'
                : size === 'sm'
                  ? 'input-sm'
                  : size === 'xs'
                    ? 'input-xs'
                    : 'input-md',
            ]"
            :required="required"
            :minlength="minlength"
            :max="max"
            :min="min"
            :step="step"
            :disabled="disabled"
            :pattern="patterns[type]"
            :autocomplete="autocomplete || 'off'"
            @input="inputValues"
            @keyup.enter="$emit('submit')"
          />

          <div
            v-if="type === 'range'"
            class="flex justify-between w-full px-2 text-xs"
          >
            <span>0</span>
            <span>{{ mid || "?" }}</span>
            <span>{{ mid ? mid * 2 : "?" }}</span>
            <span>{{ mid ? mid * 3 : "?" }}</span>
            <span>{{ mid ? mid * 4 : "?" }}</span>
          </div>
        </div>

        <div v-if="$slots.action">
          <slot name="action" />
        </div>
      </div>
      <!-- Help Prop -->
      <div v-if="help" class="w-full text-right">
        <p
          class="mr-4 text-xs text-gray-700 cursor-help tooltip tooltip-left"
          :class="{
            'absolute -translate-y-2 right-4 bg-base-100 px-1 ': labelFloat,
          }"
          :data-tip="help"
        >
          help
        </p>
      </div>

      <!-- Email Format Error Message -->
      <Transition name="fade"
        ><div
          v-if="inputState?.valid === false"
          :key="`${name}-message`"
          class="text-xs italic text-right text-error"
        >
          {{ inputState?.message }}
        </div></Transition
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

defineEmits(["submit"]);

type InputTypes =
  | "text"
  | "password"
  | "number"
  | "range"
  | "date"
  | "email"
  | "search"
  | "url"
  | "tel"
  | "textarea"
  | "select";
const inputTypes = [
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
];
type InputSizes = "lg" | "md" | "sm" | "xs";
type InputAutcompletes =
  | "off"
  | "on"
  | "name"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "email"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization"
  | "street-address"
  | "address-level1"
  | "address-level2"
  | "address-line1"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-number"
  | "cc-exp"
  | "cc-csc"
  | "bday"
  | "tel"
  | "tel-national"
  | "url"
  | "false";

const props = withDefaults(
  defineProps<{
    label: string;
    labelHidden?: boolean;
    labelFloat?: boolean;
    name: string;
    type: InputTypes;
    size?: InputSizes;
    placeholder?: string;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
    step?: number;
    mid?: number;
    value?: number | string;
    disabled?: boolean;
    noAutofill?: boolean;
    data?: any; // TODO: Do i need to rename this to "list" so it makes sense? <select></select>
    useDefaultTypes?: boolean; // Use types listed in InputTypes
    sorted?: boolean;
    autocomplete: InputAutcompletes;
    retype?: boolean;
    rows?: number;
    alpha?: boolean;
    alphanumeric?: boolean;
    nostate?: boolean;
    help?: string;
  }>(),
  {
    name: () => Math.random().toString(36).substring(4),
    required: () => false,
    noAutofill: () => false,
    retype: () => true,
    help: "",
  },
);
const formName = shallowRef<string | undefined>(undefined);
const inputState = computed(() => {
  if (!props.name || !formName.value) return;
  const form = formName.value;
  const field = props.name;
  return useGetInputState(form, field);
});
onMounted(() => {
  if (props.nostate) return;
  const currentElement = document.getElementById(`${props.name}_${props.type}`);
  formName.value = currentElement?.closest("form")?.id;
  if (formName.value) {
    const result = useGetInputState(formName.value, props.name);
    if (!props.noAutofill) if (result?.value) modelValue.value = result.value;
    if (!inputState.value) {
      setFormState({
        formName: formName.value,
        fieldName: props.name,
        fieldValue: modelValue.value,
        fieldRequiredValidity: requiredValidity.value,
      });
    }
  }
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
const modelValue = defineModel<string | number>({
  default: () => (props.type === "number" ? 0 : ""),
});

const inputValues = useDebounceFn((e: Event) => {
  const target = e.target as HTMLInputElement;
  const fieldHTMLValidity = target.validity;
  // const currentElement = document.getElementById(`${props.name}_${props.type}`);
  // const formName = currentElement?.closest("form")?.id;
  if (formName.value) {
    useCheckValidity({
      formName: formName.value,
      fieldName: props.name,
      fieldValue: target.value,
      fieldHTMLValidity,
      required: props.required,
      fieldType: props.type,
      alpha: props.alpha,
      alphanumeric: props.alphanumeric,
      min: props.min,
      max: props.max,
      minlength: props.minlength,
      maxlength: props.maxlength,
    });
  }
}, 375);

/** Sorts by data.value if sort boolean is true */
const filteredList = computed(() => {
  const typesArray = [];
  if (props.useDefaultTypes) {
    for (const type of inputTypes) {
      typesArray.push({ label: type, value: type });
    }
  }
  const arr = props.useDefaultTypes ? typesArray : props.data;
  let filtered = [];

  if (props.sorted) {
    filtered = arr.sort((a: any, b: any) => {
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

const patterns: { [key: string]: RegExp | string } = {
  phone:
    /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
};
</script>
<style>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}

.floated-label {
  @apply text-xs tracking-wide -translate-y-2 translate-x-4 absolute z-10 bg-base-100 px-1 py-0;
}
</style>
<!-- input:user-invalid,
textarea:user-invalid {
  @apply invalid:ring-1 invalid:ring-error;
} -->
