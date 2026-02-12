"use client";

import Image from "next/image";
import { MenuItem } from "@/lib/types";
import { MessageCircle, Leaf, Sparkles, ShoppingBag, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface DishCardProps {
    dish: MenuItem;
}

export function DishCard({ dish }: DishCardProps) {
    const { items, addToCart, removeFromCart, updateQuantity } = useCart();
    const cartItem = items.find(item => item.id === dish.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-card rounded-[2.5rem] border border-border/50 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden shrink-0">
                {/* Image Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {dish.image ? (
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground/20">
                        <ShoppingBag className="h-16 w-16 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Milan Signature</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                    <div className="flex flex-col gap-2">
                        {dish.isFeatured && (
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider"
                            >
                                <Sparkles className="h-3 w-3" /> Popular
                            </motion.div>
                        )}
                        <div className="bg-background/80 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border border-border/50 text-foreground uppercase tracking-widest">
                            {dish.category}
                        </div>
                    </div>

                    <div className={cn(
                        "p-2 rounded-2xl shadow-lg backdrop-blur-md border",
                        dish.isVeg ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                        <Leaf className="h-5 w-5" />
                    </div>
                </div>

                {/* Price Tag (Floating on Image) */}
                <div className="absolute bottom-6 right-6 z-20">
                    <div className="bg-black/20 backdrop-blur-2xl border border-white/20 px-4 py-2 rounded-2xl shadow-xl">
                        <span className="text-2xl font-black text-white drop-shadow-md">₹{dish.price}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                    <h3 className="font-black text-xl md:text-2xl text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {dish.name}
                    </h3>
                </div>

                <div className="mt-auto">
                    {cartItem ? (
                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-2xl border border-border">
                            <button
                                onClick={() => updateQuantity(dish.id, -1)}
                                className="h-10 w-10 flex items-center justify-center bg-background rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-black text-lg w-8 text-center">{cartItem.quantity}</span>
                            <button
                                onClick={() => updateQuantity(dish.id, 1)}
                                className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(dish)}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black text-sm shadow-xl shadow-primary/20 group/btn"
                        >
                            <ShoppingBag className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                            <span>Add to Cart</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
