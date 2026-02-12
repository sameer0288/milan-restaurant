"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={cn(
                "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl animate-in slide-in-from-top-5",
                {
                    "bg-green-600 text-white": type === "success",
                    "bg-red-600 text-white": type === "error",
                    "bg-blue-600 text-white": type === "info",
                }
            )}
        >
            <p className="font-medium">{message}</p>
            <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-white/20 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
    undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = React.useState<{
        message: string;
        type: "success" | "error" | "info";
    } | null>(null);

    const showToast = React.useCallback(
        (message: string, type: "success" | "error" | "info" = "success") => {
            setToast({ message, type });
        },
        []
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}
