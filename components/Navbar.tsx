"use client";

import Link from "next/link";
import { Menu, Phone, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { openCart, totalItems } = useCart();

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 glass-panel shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-foreground/80 hover:text-primary font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/menu"
                            className="text-foreground/80 hover:text-primary font-medium transition-colors"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/gallery"
                            className="text-foreground/80 hover:text-primary font-medium transition-colors"
                        >
                            Gallery
                        </Link>
                        <Link
                            href="/about"
                            className="text-foreground/80 hover:text-primary font-medium transition-colors"
                        >
                            About
                        </Link>
                        <button
                            onClick={openCart}
                            className="relative p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <ShoppingBag className="h-5 w-5 text-foreground" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <ThemeToggle />
                        <a
                            href="tel:+917023232376"
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">Call Now</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={openCart}
                            className="relative p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <ShoppingBag className="h-5 w-5 text-foreground" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-t border-border"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-3">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-foreground/80 hover:text-primary font-bold transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/menu"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-foreground/80 hover:text-primary font-bold transition-colors"
                            >
                                Menu
                            </Link>
                            <Link
                                href="/gallery"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-foreground/80 hover:text-primary font-bold transition-colors"
                            >
                                Gallery
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-foreground/80 hover:text-primary font-bold transition-colors"
                            >
                                About
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
