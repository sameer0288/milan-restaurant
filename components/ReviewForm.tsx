"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { storage } from "@/lib/storage";
import { Review } from "@/lib/types";

interface ReviewFormProps {
    onSuccess: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
    const { register, handleSubmit, reset } = useForm();
    const [rating, setRating] = useState(5);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                showToast("Please select an image file", "error");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast("Image must be smaller than 5MB", "error");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            let imageUrl = "";

            // Upload Image if selected
            if (selectedFile) {
                const url = await storage.uploadImage(selectedFile); // Validates compression and upload
                if (!url) {
                    showToast("Failed to upload image. Please try again.", "error");
                    setIsSubmitting(false);
                    return;
                }
                imageUrl = url;
            }

            const newReview: Omit<Review, "id" | "date" | "is_approved"> = {
                userName: data.userName,
                rating: rating,
                content: data.content,
                images: imageUrl ? [imageUrl] : [], // Store as single item array for compat
                tags: [],
                likes: 0,
                source: "Website",
            };

            await storage.addReview(newReview);

            showToast("Review submitted for approval!", "success");
            reset();
            clearFile();
            setRating(5);
            onSuccess();
        } catch (error) {
            console.error(error);
            showToast("Failed to submit review", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-2xl shadow-lg border border-border">
            <h3 className="text-xl font-bold mb-4 font-playfair">Write a Review</h3>

            <div className="flex gap-2 mb-4 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-colors p-1 rounded-full hover:bg-muted ${rating >= star ? "text-yellow-400" : "text-muted-foreground/30"}`}
                    >
                        <Star className={`h-8 w-8 ${rating >= star ? "fill-yellow-400" : "fill-current"}`} />
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-1 gap-4">
                <Input
                    {...register("userName", { required: true })}
                    placeholder="Your Name"
                    className="w-full bg-background"
                />
            </div>

            <Textarea
                {...register("content", { required: true })}
                placeholder="Share your experience dining with us..."
                className="w-full min-h-[100px] bg-background"
            />

            <div>
                <label className="block text-sm font-medium mb-2">
                    Add Photo (Optional)
                </label>

                {!previewUrl ? (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted/30 transition-all">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload 1 photo</span>
                    </label>
                ) : (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={clearFile}
                            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                ) : "Submit Review"}
            </Button>
        </form>
    );
}
