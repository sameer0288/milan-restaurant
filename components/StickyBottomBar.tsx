"use client";

import { MessageCircle, Phone, MapPin, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export function StickyBottomBar() {
    const { totalItems, totalPrice, openCart } = useCart();

    const handleWhatsApp = () => {
        window.open(
            "https://wa.me/917023232376?text=Hello Milan Restaurant, I want to enquire about food/order.",
            "_blank"
        );
    };

    const handleCall = () => {
        window.location.href = "tel:+917023232376";
    };

    const handleDirections = () => {
        window.open("https://maps.app.goo.gl/Gg0lOVNCUNe6xcjWO", "_blank");
    };

    return (
        <AnimatePresence mode="wait">
            {totalItems > 0 ? (
                <motion.div
                    key="cart-bar"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-border shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:hidden p-4"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{totalItems} Items Added</span>
                            <span className="text-xl font-black text-primary">₹{totalPrice}</span>
                        </div>
                        <button
                            onClick={openCart}
                            className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-transform"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            View Order
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="contact-bar"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-border shadow-2xl md:hidden"
                >
                    <div className="grid grid-cols-3 gap-3 p-3 safe-bottom">
                        <button
                            onClick={handleWhatsApp}
                            className="flex flex-col items-center justify-center gap-1 bg-green-600 text-white rounded-xl py-3 active:scale-95 transition-transform shadow-lg shadow-green-200 dark:shadow-none"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-[10px] uppercase font-bold tracking-wide">WhatsApp</span>
                        </button>

                        <button
                            onClick={handleCall}
                            className="flex flex-col items-center justify-center gap-1 bg-red-700 text-white rounded-xl py-3 active:scale-95 transition-transform shadow-lg shadow-red-200 dark:shadow-none"
                        >
                            <Phone className="h-5 w-5" />
                            <span className="text-[10px] uppercase font-bold tracking-wide">Call</span>
                        </button>

                        <button
                            onClick={handleDirections}
                            className="flex flex-col items-center justify-center gap-1 bg-blue-600 text-white rounded-xl py-3 active:scale-95 transition-transform shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            <MapPin className="h-5 w-5" />
                            <span className="text-[10px] uppercase font-bold tracking-wide">Map</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
