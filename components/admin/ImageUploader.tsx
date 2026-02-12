"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { storage } from "@/lib/storage"; // Updated async storage
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    value?: string; // URL
    onChange: (url: string) => void;
    onRemove: () => void;
}

export function ImageUploader({ value, onChange, onRemove }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { showToast } = useToast();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations
        if (!file.type.startsWith("image/")) {
            showToast("Please select an image file", "error");
            return;
        }

        // 5MB limit check (Supabase allows larger but keeping reasonable)
        if (file.size > 5 * 1024 * 1024) {
            showToast("Image size must be less than 5MB", "error");
            return;
        }

        try {
            setIsUploading(true);
            const publicUrl = await storage.uploadImage(file);

            if (publicUrl) {
                onChange(publicUrl);
                showToast("Image uploaded successfully", "success");
            } else {
                showToast("Upload failed. Please try again.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error uploading image", "error");
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative w-full h-48 bg-muted rounded-xl overflow-hidden border border-border group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-sm"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => !isUploading && inputRef.current?.click()}
                    disabled={isUploading}
                    className={cn(
                        "w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-xl hover:border-primary hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-3 text-muted-foreground",
                        isUploading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                    <div className="text-center">
                        <span className="font-medium text-foreground block">
                            {isUploading ? "Uploading..." : "Click to upload image"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            JPG, PNG, WebP (Max 5MB)
                        </span>
                    </div>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
