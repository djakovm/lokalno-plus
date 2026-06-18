import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { createId } from "../services/storage";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const defaultToastContext: ToastContextValue = {
  showToast: () => undefined
};

export const ToastContext = createContext<ToastContextValue>(defaultToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-white text-slate-900",
  error: "border-rose-200 bg-white text-slate-900",
  info: "border-sky-200 bg-white text-slate-900"
};

const iconStyles: Record<ToastType, string> = {
  success: "text-emerald-600",
  error: "text-rose-600",
  info: "text-sky-600"
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const toast: Toast = {
        id: createId("toast"),
        message,
        type
      };

      setToasts((current) => [...current, toast]);
      window.setTimeout(() => removeToast(toast.id), 3600);
    },
    [removeToast]
  );

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? XCircle : Info;
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft ${toastStyles[toast.type]}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconStyles[toast.type]}`} />
              <p className="flex-1 text-sm font-medium leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Затвори известување"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
