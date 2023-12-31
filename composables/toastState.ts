import { v4 as uuid } from "uuid";
export const useToast = () => {
  return ref();
};

type ToastTypes = "success" | "error" | "warning" | "info";
const defaultIcons = {
  error: "&#9888;",
  success: "&check;",
  warning: "&#9888;",
  info: "&#9873;",
};
class Toast {
  id?: uuid;
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  /** Use HTML Entities */
  icon?: string;

  constructor(type: ToastTypes, options: Toast) {
    this.id = uuid();
    this.type = type || "error";
    this.title = options?.title || defaultToastOptions.title;
    this.message = options?.message || defaultToastOptions.message;
    this.autoClose = options?.autoClose || defaultToastOptions.autoClose;
    this.duration = options?.duration || defaultToastOptions.duration;
    this.icon = options?.icon || defaultIcons[this.type];
  }
}

const defaultToastOptions: Toast = {
  type: "error",
  title: "Error",
  message: "Oops! Something went wrong",
  autoClose: true,
  duration: 8,
};

const toasts = ref<Toast[]>([]);

/**
 * Creates a new toast and adds it to the list of toasts.
 *
 * @param {ToastTypes} type - The type of the toast.
 * @param {Toast} [options] - Optional params for the toast.
 */
export function newToast(type: ToastTypes, options?: Toast) {
  toasts.value.push(
    new Toast(type, {
      title: options?.title,
      message: options?.message,
      autoClose: options?.autoClose,
      duration: options?.duration,
      icon: options?.icon,
    }),
  );
}

export function closeToast(id: uuid) {
  toasts.value.splice(
    toasts.value.findIndex((toast) => toast.id === id),
    1,
  );
}

export function getToasts() {
  return toasts;
}
export function getToastType() {
  return Toast;
}
