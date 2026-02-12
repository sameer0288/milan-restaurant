"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyBottomBar } from "@/components/StickyBottomBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { storage } from "@/lib/storage";
import { GalleryImage } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Camera, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadImages = async () => {
            try {
                const data = await storage.getGallery();
                setImages(data);

                // Load liked images from local storage
                const savedLikes = localStorage.getItem("milan-gallery-likes");
                if (savedLikes) {
                    setLikedImages(new Set(JSON.parse(savedLikes)));
                }
            } catch (error) {
                console.error("Failed to load gallery", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadImages();
    }, []);

    const handleLike = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (likedImages.has(id)) return;

        try {
            await storage.likeGalleryImage(id);
            const newLikedImages = new Set(likedImages).add(id);
            setLikedImages(newLikedImages);
            localStorage.setItem("milan-gallery-likes", JSON.stringify(Array.from(newLikedImages)));

            // Optimistically update local state count
            setImages(prev => prev.map(img =>
                img.id === id ? { ...img, likes: (img.likes || 0) + 1 } : img
            ));
        } catch (err) {
            // Detailed error logging
            storage.logError("Gallery Like operation failed. Check Supabase 'gallery' table for ID: " + id, err);
        }
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-700">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Header Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-neutral-50/50" />
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-full bg-yellow-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-card border border-border shadow-xl mb-8"
                        >
                            <Camera className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">Visual Journey</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-[9rem] font-black font-playfair text-foreground tracking-tighter leading-none mb-10"
                        >
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Milan</span> <br /> Lookbook
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-3xl text-gray-400 max-w-2xl mx-auto font-medium lowercase tracking-tighter"
                        >
                            a curation of flavors & moments captured in time.
                        </motion.p>
                    </div>
                </section>

                {/* Gallery Grid - Masonry Style */}
                <section className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-gray-50 rounded-[3rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {images.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={() => setSelectedImage(image)}
                                    className="relative group cursor-pointer break-inside-avoid"
                                >
                                    <div className="relative overflow-hidden rounded-[3rem] border border-border/50 shadow-2xl shadow-primary/5 bg-card">
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Cinematic Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />

                                        {/* Actions Layer */}
                                        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={(e) => handleLike(e, image.id)}
                                                    className={cn(
                                                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border",
                                                        likedImages.has(image.id)
                                                            ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/40"
                                                            : "bg-white/20 border-white/20 text-white hover:bg-white hover:text-red-500"
                                                    )}
                                                >
                                                    <Heart className={cn("h-6 w-6", likedImages.has(image.id) && "fill-current")} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                                                        <ZoomIn className="h-5 w-5" />
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest">
                                                        {image.likes || 0} Likes
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">Branding & Ambience</span>
                                                    <h3 className="text-2xl font-black font-playfair text-white leading-tight">
                                                        {image.alt || "Milan Moments"}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && images.length === 0 && (
                        <div className="text-center py-40">
                            <div className="bg-gray-50 h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Camera className="h-12 w-12 text-gray-200" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2">The canvas is blank</h3>
                            <p className="text-gray-400 font-medium">Capture some memories and upload them to the gallery.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
            <StickyBottomBar />
            <WhatsAppButton />

            {/* Cinematic Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-10 right-10 h-16 w-16 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/10 hover:rotate-90"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="relative max-w-full max-h-screen"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                className="max-w-full max-h-[80vh] rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,0.8)] object-contain border border-white/10"
                                alt={selectedImage.alt}
                            />

                            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10">
                                <div className="text-left">
                                    <h4 className="text-white text-3xl md:text-5xl font-black font-playfair tracking-tighter">
                                        {selectedImage.alt || "Milan Signature Photography"}
                                    </h4>
                                    <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">captured at milana restaurant</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-white">{selectedImage.likes || 0}</div>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Fans</div>
                                    </div>
                                    <button
                                        onClick={(e) => handleLike(e, selectedImage.id)}
                                        className={cn(
                                            "h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 border-2",
                                            likedImages.has(selectedImage.id)
                                                ? "bg-red-600 border-red-500 text-white shadow-2xl shadow-red-600/50"
                                                : "bg-white text-black border-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-2xl"
                                        )}
                                    >
                                        <Heart className={cn("h-8 w-8", likedImages.has(selectedImage.id) && "fill-current")} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
