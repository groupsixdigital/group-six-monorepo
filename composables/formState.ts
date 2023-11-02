import isEmail from "validator/es/lib/isEmail";
export const useFormState = () => useState("form", () => new Map());

/**
 * State management for all <Forms validity
 * @param name name of form. Should be pulled from dom: id="". Will be normalized but name should already include type.
 * @returns global form validity
 */
export function useGetFormState(formName: string) {
  return useFormState().value.get(formNameFormatter(formName));
}

/**
 *
 * @param formName String of form name. Obtain from dom i.e. currentElement.closest()
 * @param fieldName string name
 * @returns input object.
 */
export function useGetInputState(formName: string, fieldName: string) {
  return useFormState().value?.get(formNameFormatter(formName))?.get(fieldName);
}

function formNameFormatter(formName: string) {
  if (!formName) return;
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
  fieldRequiredValidity: boolean;
}

/**
 * State management for all <Forms validity
 * @param {SetOptions}
 * @returns NOTHING
 */
export async function setFormState({
  formName,
  fieldName,
  fieldValidity,
  fieldValidityMessage,
  fieldDirty,
  fieldValue,
  fieldRequiredValidity,
}: SetOptions) {
  if (!formName || !fieldName) return;

  // always set a valid & dirty status on a field & form
  class statusBuilder {
    constructor(
      valid = true,
      dirty = false,
      value = "",
      message = "",
      required = true
    ) {
      this.valid = valid;
      this.dirty = dirty;
      this.value = value;
      this.message = message;
      this.required = required;
    }
  }

  const status = new statusBuilder(
    fieldValidity,
    fieldDirty,
    fieldValue,
    fieldValidityMessage,
    fieldRequiredValidity
  );

  // always sets and updates field in validityState > form
  const fieldMap = new Map().set(fieldName, status);
  if (useFormState().value.has(formName))
    useFormState().value.get(formName).set(fieldName, status);
  else useFormState().value.set(formNameFormatter(formName), fieldMap);
}

/**
 * REMOVES FORM FROM State management for all <Forms validity
 * @param formName string ID of <Form name=?>
 * @returns NOTHING
 */
function clearFormState(name: string) {
  useFormState().value.delete(`form_name`);
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
  required?: boolean;
}
export async function useCheckValidity({
  formName,
  fieldName,
  fieldValue,
  fieldHTMLValidity,
  required,
  fieldType,
  alpha,
  alphanumeric,
  min,
  max,
  minlength,
  maxlength,
}: CheckValidityObject) {
  if (!formName || !fieldName) return;
  // DIRTY
  const dirty =
    useFormState().value?.get(formName)?.get(fieldName)?.value !== fieldValue;

  // VALIDITY
  let valid = true;
  let message = undefined;
  let fieldRequiredValidity = true;

  // REQUIRED
  if (required) {
    if (
      fieldValue === "" ||
      fieldValue === null ||
      fieldValue === 0 ||
      fieldValue === undefined
    ) {
      fieldRequiredValidity = false;
    }
  }

  if (fieldHTMLValidity.tooShort || minlength) {
    if (fieldValue.length < minlength) {
      message = messages("tooShort", { fieldName, minlength });
      valid = false;
    }
  }

  if (fieldHTMLValidity.tooLong || maxlength) {
    if (fieldValue.length > maxlength) {
      message = messages("tooLong", { fieldName, maxlength });
      valid = false;
    }
  }

  if (fieldHTMLValidity.patternMismatch || fieldHTMLValidity.typeMismatch) {
    message = messages("typeMismatch", { fieldType });
    valid = false;
  }

  if (typeof fieldValue === "number") {
    if (fieldValue > max) {
      valid = false;
      message = messages("rangeOverflow", { fieldName, max });
    }
    if (fieldValue < min) {
      valid = false;
      message = messages("rangeUnderflow", { fieldName, min });
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
    fieldRequiredValidity,
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
  which:
    | "retype"
    | "email"
    | "tel"
    | "patternMismatch"
    | "rangeOverflow"
    | "rangeUnderflow"
    | "tooLong"
    | "tooShort"
    | "typeMismatch"
    | "valid"
    | "valueMissing",
  { fieldName, min, max, maxlength, minlength, fieldType }: MessagesObject
) {
  const messagesCatalog = {
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
  return messagesCatalog[which] as string;
}

const patterns = {
  phone:
    /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  alpha: /[^a-z ]/gi,
  alphanumeric: /[^a-z0-9 ]/gi,
};
