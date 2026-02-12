"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag, MessageCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function CartDrawer() {
    const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();

    // Prevent background scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;

        let message = "Hello Milan Restaurant, I would like to order:\n\n";
        items.forEach((item) => {
            message += `• ${item.quantity} x ${item.name} (₹${item.price})\n`;
        });
        message += `\nTotal Amount: ₹${totalPrice}`;
        message += "\n\nPlease confirm my order.";

        const url = `https://wa.me/917023232376?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[70] flex flex-col border-l border-zinc-200 dark:border-zinc-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-bold">Your Order</h2>
                                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                    {items.length} Items
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-60">
                                    <ShoppingBag className="h-16 w-16 mb-2" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm">Add some delicious dishes to get started!</p>
                                    <Button variant="outline" onClick={closeCart} className="mt-4">
                                        Browse Menu
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800"
                                    >
                                        <div className="h-16 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                                                <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="h-6 w-6 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="h-6 w-6 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 safe-bottom">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-muted-foreground font-medium">Total Amount</span>
                                    <span className="text-2xl font-black font-playfair">₹{totalPrice}</span>
                                </div>
                                <Button
                                    onClick={handleWhatsAppCheckout}
                                    className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-200 dark:shadow-none flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Order on WhatsApp
                                </Button>
                                <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-wider font-bold">
                                    Secure checkout via WhatsApp
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
