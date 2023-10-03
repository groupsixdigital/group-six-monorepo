<template>
  <div class="form-control" :id="`${name}_${type}`">
<div class="flex items-center">
  <label class="label pb-1 pt-0" :class="{ 'sr-only': labelHidden }" :for="name"
      ><span v-text="label" />
      <span v-if="!requiredValidity" class="text-warning italic text-xs -mb-4">
        required</span
      >
    </label>

    <div class="w-full relative flex items-center">
      <!-- Icon: Named Slot -- front side of input -->
      <div class="ml-3 text-2xl absolute">
        <slot name="icon" />
      </div>
      <!-- Icon: Back side of Input -- clear input -->
      <div
        v-if="modelValue && type !== 'number' && type !== 'date'"
        class="mr-3 absolute right-0 tooltip"
        data-tip="Clear Input">
        <span
          class="h-6 w-6 text-lg text-neutral-content hover:text-error cursor-pointer"
          @click="$emit('update:modelValue', '')"
          >&#10005;</span
        >
      </div>
      <!-- SHOW IF TYPE == TEXT AREA -->
      <textarea v-if="type === 'textarea'" :name="name" :placeholder="placeholder" :id="`${name}_${type}`" :minlength="minlength" :value="modelValue" :rows="rows" class="textarea textarea-bordered w-full" :required="required" @input="$emit('update:modelValue', $event.target.value)" @blur="checkValidity" :class="{
          'pl-10': $slots.icon,
          'ring-error ring-1': !validity
        }" />
        <!-- ALL STANDARD INPUTS -->
      <input
      v-else
        :type="type"
        :name="name"
        :id="`${name}_${type}`"
        :placeholder="placeholder"
        class="input input-bordered w-full"
        :class="{
          'range': type === 'range',
          'pl-10': $slots.icon,
          'ring-error ring-1': !validity
        }"
        :required="required"
        :minlength="minlength"
        :max="max"
        :min="min"
        :step="step"
        :disabled="disabled"
        :autofocus="autofocus"
        :pattern="patterns[type] || undefined"
        :value="modelValue"
        :autocomplete="autocomplete || 'off'"
        @input="inputValues"
         @blur="checkValidity" />


      <div
        v-if="type === 'range'"
        class="w-full flex justify-between text-xs px-2">
        <span>0</span>
        <span>{{ mid || "?" }}</span>
        <span>{{ mid ? mid * 2 : "?" }}</span>
        <span>{{ mid ? mid * 3 : "?" }}</span>
        <span>{{ mid ? mid * 4 : "?" }}</span>
      </div>
    </div>
    <!-- action icons to the right of the input -- provides a dirty feeling -->
    <div class="text-2xl">
        <slot name="actionIcon" :isDirty="dirty"></slot>
      </div>
    <!-- Email Format Error Message -->
    <div v-if="!validity" class="text-error italic text-xs text-right">
      {{ validityMessage }}
    </div>
</div>
  </div>
</template>

<script setup lang="ts">
import { emit } from 'process';

type AutoComplete =
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
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-number"
  | "cc-exp"
  | "cc-csc"
  | "bday"
  | "tel"
  | "tel-national"
  | "url";

type InputType =
  | "text"
  | "password"
  | "number"
  | "range"
  | "date"
  | "email"
  | "search" 
  | "url"
  | "tel"
  | "textarea";

const props = defineProps<{
  label: string;
  labelHidden?: boolean;
  name: string;
  type: InputType;
  placeholder?: string;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  max?: number;
  min?: number;
  step?: number;
  mid?: number;
  value?: number;
  modelValue: any;
  disabled?: boolean;
  submitting?: boolean;
  autocomplete?: AutoComplete;
  retype?: any;
  showValidIcon?: boolean;
  autofocus?: boolean;
  rows?: number;
  alpha?: boolean;
  alphanumeric?: boolean;
}>();

// use v-model on component in parent
const emits = defineEmits(["update:modelValue", "validity"]);
// true: valid, false: invalid
const validity = ref(true);
// true: required field is filled, false: required field is empty
const requiredValidity = ref(true);
// message shows if validity == false
const validityMessage = ref("");
// TODO: make actual dirty -- currently showing dirty when field is blurred.
const dirty = ref(false);

async function inputValues(e: InputEvent) {
  let oldValue = props.modelValue;
let newValue = e.target.value;
if(oldValue !== newValue) dirty.value = true
  emits('update:modelValue', e.target.value)
}

async function checkValidity(e: InputEvent) {
  let newValue = e.target.value
  // compare values, then determine if is now dirty.
  const result = e.target.validity;
  let message = "";

  
  /* This sections grabs validity info from HTML5 */
  if (
    result.valid === false ||
    (props.retype === false && props.retype !== undefined)
  ) {
    validity.value = false;

    if (props.retype === false) validity.value = false;

    if (props.retype === false && props.type === "password")
      message = messages.retype;
    else if (result.tooShort) message = messages.tooShort;
    else if (result.tooLong) message = messages.tooLong;
    else if (result.patternMismatch || result.typeMismatch)
      message = messages[props.type];
  } else {
    message = "";
    
    validity.value = true;
  }
  if (props.required) requiredValidity.value = !result.valueMissing;
  validityMessage.value = message;

  /* Add in additional validators - if field is blank do not apply validation */
  if(e.target.value.length > 0) {
    if(props.type === 'email') {
    const {default: isEmail} = await import('validator/es/lib/isEmail.js')
    if(!isEmail(e.target.value )) {
      validityMessage.value = messages.email
      validity.value = false
    }
  }
  if(props.type === 'tel') {
    if(!e.target.value.match(patterns.phone)) {
      validityMessage.value = messages.tel;
      validity.value = false
    }
  }
  }
  


  // Remove erroneous characters. If listed props are found on component, corresponding patterns will be applied to the text, cleaned, and emitted to parent component.
  const textCleaners = ['alpha', 'alphanumeric'];
  textCleaners.forEach(v => {
    if(props[v] === true) {
      newValue = newValue.replace(patterns[v], '')
    }
  });
  
  
  
  const currentElement = document.getElementById(`${props.name}_${props.type}`)
  const formElement = currentElement?.closest("form")?.id
  emits('update:modelValue', newValue)
  setFormState(formElement, props.name, newValue)
  setValidity(formElement, props.name, validity.value)
}

onMounted(() => {
  if (
    props.required &&
    (props.modelValue === "" ||
      props.modelValue === undefined ||
      props.modelValue === null)
  )
    requiredValidity.value = false;
});

const messages = {
  // badInput: false,
  // customError: false,
  retype: "Passwords do not match!",
  email: "Must be a valid email. Example: username@domain.com",
  tel: "Must be a valid phone number. Example: 555-555-5555",
  patternMismatch: true,
  rangeOverflow: `${props.name} must be less than ${props.max}`,
  rangeUnderflow: `${props.name} must be greater than ${props.min}`,
  // stepMismatch: false,
  tooLong: `${props.name} must be shorter than ${props.maxlength} characters.`,
  tooShort: `${props.name} must be longer than ${props.minlength} characters`,
  typeMismatch: `${props.name} must be a valid format: ${
    props.type === "email" ? "user@domain.com" : "Not email?"
  }`,
  valid: `${props.name} is invalid.`,
  valueMissing: `${props.name} is a required field.`
};

const patterns = {
  phone: /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  alpha: /[^a-z ]/gi,
  alphanumeric: /[^a-z0-9 ]/gi
}
</script>
<style>
input:user-invalid, textarea:user-invalid {
@apply invalid:ring-1 invalid:ring-error
}
</style>