"use client";

import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { GalleryImage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "./ImageUploader";
import { useToast } from "@/components/ui/toast";
import { Plus, X, Trash2, Heart, GripVertical, Save, Loader2, Camera, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

// --- Sortable Item Component ---
function SortableImage({
    image,
    index,
    onDelete,
}: {
    image: GalleryImage;
    index: number;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.3 : 1,
    };

    const isShowcase = index < 5;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative aspect-square rounded-[2rem] overflow-hidden shadow-sm bg-card touch-none transition-all duration-300",
                isShowcase ? "border-2 border-primary/50 shadow-primary/10" : "border border-border/50",
                "hover:shadow-2xl hover:scale-[1.02]",
                isDragging && "opacity-50"
            )}
        >
            <img src={image.url} className="w-full h-full object-cover pointer-events-none select-none" alt={image.alt} />

            {/* Showcase Badge - Premium Look */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                <div className={cn(
                    "backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black border shadow-lg flex items-center gap-1.5",
                    isShowcase ? "bg-primary/90 text-white border-white/20" : "bg-black/60 text-white border-white/10"
                )}>
                    {isShowcase && <Sparkles className="h-3 w-3 fill-white animate-pulse" />}
                    #{index + 1}
                </div>
            </div>

            {/* Drag Handle Indicator */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white/80 hover:bg-black/60">
                    <GripVertical className="h-4 w-4" />
                </div>
            </div>

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                        <Heart className="h-3 w-3 fill-current" />
                        {image.likes || 0}
                    </div>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(image.id);
                        }}
                        className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow-lg transition-all hover:scale-110 active:scale-95"
                        title="Delete Image"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Manager Component ---
export function GalleryManager() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        url: "",
        alt: "",
    });
    const { showToast } = useToast();

    // Reliable Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        try {
            const data = await storage.getGallery();
            const sorted = [...data].sort((a, b) => {
                if (a.showcaseOrder && b.showcaseOrder) return a.showcaseOrder - b.showcaseOrder;
                if (a.showcaseOrder) return -1;
                if (b.showcaseOrder) return 1;
                return 0; // fallback
            });
            setImages(sorted);
        } catch (error) {
            console.error(error);
            showToast("Failed to load gallery", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                setHasUnsavedChanges(true);
                return newOrder;
            });
        }
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        try {
            const updates = images.map((img, index) =>
                storage.updateGalleryOrder(img.id, index + 1)
            );
            await Promise.all(updates);

            // Reload to conform
            await loadGallery();
            setHasUnsavedChanges(false);
            showToast("Showcase order updated!", "success");
        } catch (error) {
            console.error("Failed to save order", error);
            showToast("Failed to save new order", "error");
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await storage.addGalleryImage(formData.url, formData.alt);
            showToast("Image added!", "success");
            setIsFormOpen(false);
            setFormData({ url: "", alt: "" });
            loadGallery();
        } catch (error) {
            console.error(error);
            showToast("Failed to upload", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this gallery image?")) {
            try {
                await storage.deleteGalleryImage(id);
                showToast("Image deleted", "success");
                loadGallery();
            } catch (error) {
                console.error(error);
                showToast("Failed to delete image", "error");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-8 glass-panel rounded-[2.5rem] gap-6 bg-card/30 backdrop-blur-xl border border-border/50 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-black font-playfair tracking-tight flex items-center gap-3">
                        <Camera className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                        Visual Journey
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground uppercase font-black tracking-widest mt-2 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-primary"></span>
                        Status: <span className={hasUnsavedChanges ? "text-amber-500 animate-pulse" : "text-emerald-500"}>
                            {hasUnsavedChanges ? "Unsaved Changes" : "Synchronized"}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 relative z-10">
                    <AnimatePresence>
                        {hasUnsavedChanges && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <Button
                                    onClick={handleSaveOrder}
                                    disabled={isSavingOrder}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 font-bold tracking-wide"
                                >
                                    {isSavingOrder ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    Save Order
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white h-12 px-6 rounded-2xl shadow-lg shadow-primary/20 font-bold tracking-wide"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Add New Moment
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                        <div key={i} className="aspect-square bg-muted/50 animate-pulse rounded-[2rem]" />
                    ))}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="space-y-6">
                        {/* Showcase Section Hint */}
                        <div className="flex items-center gap-2 px-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-primary/80">
                                Home Showcase (Drag Top 5 Here)
                            </span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                        </div>

                        <SortableContext
                            items={images.map(img => img.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {images.map((image, index) => (
                                    <div key={image.id} className={cn("transition-all", index < 5 && "lg:col-span-1")}>
                                        <SortableImage
                                            image={image}
                                            index={index}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                </DndContext>
            )}

            {images.length === 0 && !isLoading && (
                <div className="py-32 text-center border-2 border-dashed border-border rounded-[3rem] bg-card/30 backdrop-blur-sm">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
                    <p className="text-muted-foreground font-medium">No photos in the gallery yet.</p>
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-white/10"
                        >
                            <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
                                <h2 className="text-2xl font-black font-playfair text-white">Share a Moment</h2>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><X className="h-6 w-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Composition</label>
                                    <div className="rounded-[1.5rem] overflow-hidden border border-white/10 bg-black/40">
                                        <ImageUploader
                                            value={formData.url}
                                            onChange={v => setFormData({ ...formData, url: v })}
                                            onRemove={() => setFormData({ ...formData, url: "" })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Narrative</label>
                                    <Input
                                        value={formData.alt}
                                        onChange={e => setFormData({ ...formData, alt: e.target.value })}
                                        placeholder="Describe this moment..."
                                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl placeholder:text-white/20 focus:border-primary/50"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="ghost" className="h-14 flex-1 rounded-2xl text-white/60 hover:text-white" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={!formData.url} className="h-14 flex-1 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                                        Upload
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
