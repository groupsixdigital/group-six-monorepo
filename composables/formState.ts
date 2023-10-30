import isEmail from "validator/es/lib/isEmail";
const validityState = shallowRef(new Map());

/**
 * State management for all <Forms validity
 * @param name name of form
 * @returns global form validity
 */
function useGetFormState(formName: string) {
  return validityState.value.get(formName);
}

function formNameFormatter(formName: string) {
  if (formName.includes("form_")) return formName;
  else return "form_" + formName;
}

interface SetOptions {
  formName: string;
  fieldName: string;
  fieldValidity: boolean;
  fieldDirty: boolean;
  fieldValue: string | number;
  fieldValidityMessage: string;
}

/**
 * State management for all <Forms validity
 * @param {SetOptions}
 * @returns NOTHING
 */
async function setFormState({
  formName,
  fieldName,
  fieldValidity,
  fieldValidityMessage,
  fieldDirty,
  fieldValue,
}: SetOptions) {
  if (!formName || !fieldName) return;

  // always set a valid & dirty status on a field & form
  class statusBuilder {
    constructor(valid, dirty, value, message) {
      valid !== undefined && valid !== null
        ? (this.valid = valid)
        : (this.valid = true);
      dirty !== undefined && dirty !== null
        ? (this.dirty = dirty || false)
        : (this.dirty = false);
      if (value !== undefined && value !== null) this.value = value;
      if (message !== undefined && message !== null) this.message = message;
    }
  }

  const status = new statusBuilder(
    fieldValidity,
    fieldDirty,
    fieldValue,
    fieldValidityMessage
  );

  // always sets and updates field in validityState > form
  const fieldMap = new Map().set(fieldName, status);
  return await validityState.value
    .set(formNameFormatter(formName), fieldMap)
    .get(formName)
    .get(fieldName);
}

/**
 * REMOVES FORM FROM State management for all <Forms validity
 * @param formName string ID of <Form name=?>
 * @returns NOTHING
 */
function clearFormState(name: string) {
  validityState.value.delete(`form_name`);
}

interface CheckValidityObject {
  formName: string;
  fieldName: string;
  fieldValue: string | number;
  fieldHTMLValidity: any;
  fieldType: string;
  alpha?: boolean;
  alphanumeric?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
}
async function useCheckValidity({
  formName,
  fieldName,
  fieldValue,
  fieldHTMLValidity,
  fieldType,
  alpha,
  alphanumeric,
  min,
  max,
  minlength,
  maxlength,
}: CheckValidityObject) {
  if (!formName || !fieldName) return;
  let newValue = fieldValue;
  // DIRTY
  let dirty = false;
  if (
    validityState.value?.get(formName)?.get(fieldName)?.get("value") !==
    fieldValue
  )
    dirty = true;

  // VALIDITY
  let valid = true;
  let message = undefined;

  if (fieldHTMLValidity.tooShort || fieldValue.length < minlength) {
    message = messages.tooShort;
    valid = false;
  }

  if (fieldHTMLValidity.tooLong || fieldValue.length > maxlength) {
    message = messages.tooLong;
    valid = false;
  }

  if (fieldHTMLValidity.patternMismatch || fieldHTMLValidity.typeMismatch) {
    message = messages[fieldType];
    valid = false;
  }

  if (typeof fieldValue === "number") {
    if (fieldValue > max) {
      valid = false;
      message = messages("tooLong", { fieldName, maxlength });
    }
    if (fieldValue < min) {
      valid = false;
      message = messages("tooShort", { fieldName, minlength });
    }
  }

  if (fieldType === "email") {
    if (!isEmail(fieldValue)) {
      message = messages("email", { fieldType });
      valid = false;
    }
  }

  if (fieldType === "tel") {
    if (!fieldValue.match(patterns.phone)) {
      message = messages("tel", { fieldType });
      valid = false;
    }
  }

  // Password Retype

  // Remove erroneous characters.
  if (alpha) newValue = fieldValue.replace(patterns.alpha, "");
  if (alphanumeric) newValue = fieldValue.replace(patterns.alphanumeric, "");

  // Finally
  return await setFormState({
    formName,
    fieldName,
    fieldValidity: valid,
    fieldValidityMessage: message,
    fieldDirty: dirty,
    fieldValue,
  });
}

interface MessagesObject {
  fieldName?: string;
  min?: number;
  max?: number;
  maxlength?: number;
  minlength?: number;
  fieldType?: string;
}
function messages(
  which: string,
  { fieldName, min, max, maxlength, minlength, fieldType }: MessagesObject
) {
  const catalog = {
    retype: "Passwords do not match!",
    email: "Must be a valid email. Example: username@domain.com",
    tel: "Must be a valid phone number. Example: 555-555-5555",
    patternMismatch: true,
    rangeOverflow: `${fieldName || "field"} must be less than ${max}`,
    rangeUnderflow: `${fieldName || "field"} must be greater than ${min}`,
    tooLong: `${
      fieldName || "field"
    } must be shorter than ${maxlength} characters.`,
    tooShort: `${
      fieldName || "field"
    } must be longer than ${minlength} characters`,
    typeMismatch: `${fieldName || "field"} must be a valid format: ${
      fieldType === "email" ? "user@domain.com" : "Not email?"
    }`,
    valid: `${fieldName} is invalid.`,
    valueMissing: `${fieldName} is a required field.`,
  };
  return catalog[which] as string;
}

const patterns = {
  phone:
    /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  alpha: /[^a-z ]/gi,
  alphanumeric: /[^a-z0-9 ]/gi,
};

export { useGetFormState, setFormState, clearFormState, useCheckValidity };
