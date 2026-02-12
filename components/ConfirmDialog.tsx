"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    variant?: "destructive" | "default";
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    variant = "destructive"
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 max-w-md w-full overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${variant === "destructive" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}>
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black font-playfair">{title}</h3>
                        </div>

                        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-10">
                            {message}
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={variant}
                                onClick={() => {
                                    onConfirm();
                                    onCancel();
                                }}
                                className={`flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest ${variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}`}
                            >
                                {confirmLabel}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
