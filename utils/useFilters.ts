import { useNow, useDateFormat } from "@vueuse/core";

function formatPhone(value: string | number) {
  if (value !== undefined) {
    const newValue = `${value}`.match(/[0-9]*/g)?.join("");
    if (newValue?.length !== 10) return value;
    return `(${newValue?.substring(0, 3)}) ${newValue?.substring(
      3,
      6
    )}-${newValue?.substring(6, 10)}`;
  }
}

function formatShortDate(value: Date | string) {
  if (value !== undefined && value !== null) {
    return useDateFormat(value, "MMMDD");
  } else return value;
}

function formatNormalDate(value: Date | string) {
  if (value !== undefined && value !== null) {
    return useDateFormat(value, "MMM D, YYYY");
  }
}

function formatDollars(value: Number | string) {
  if (value !== undefined && value !== null) {
    const comma = `${value}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return `$${comma}`;
  }
}

function formatCapitalizeFirstLetter(value: string) {
  if (value !== undefined && value !== null) {
    const split = value.split("");
    split[0].toUpperCase();
    return split.join("");
  }
}

export default function () {
  return {
    formatPhone,
    formatShortDate,
    formatNormalDate,
    formatDollars,
    formatCapitalizeFirstLetter
  };
}
