"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyBottomBar } from "@/components/StickyBottomBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { DishCard } from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { MenuHighlight, MenuScan, MenuItem, MenuCategory } from "@/lib/types";
import { Search, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const categories: (MenuCategory | "All")[] = [
    "All",
    "Fast Food",
    "North Indian",
    "South Indian",
    "Chinese",
    "Beverages",
    "Sweets",
];

export default function MenuPage() {
    const [highlights, setHighlights] = useState<MenuHighlight[]>([]);
    const [scans, setScans] = useState<MenuScan[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | "All">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedscan, setSelectedScan] = useState<MenuScan | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const h = await storage.getHighlights();
            setHighlights(h);

            const s = await storage.getScans();
            setScans(s.sort((a, b) => (a.order || 0) - (b.order || 0)));

            const m = await storage.getMenu();
            setMenuItems(m);

            // Extract unique categories
            const uniqueCats = Array.from(new Set(m.map(item => item.category)));
            setDynamicCategories(["All", ...uniqueCats]);
        };
        loadData();
    }, []);

    useEffect(() => {
        let items = menuItems;
        if (activeCategory !== "All") {
            items = items.filter(item => item.category === activeCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => item.name.toLowerCase().includes(query));
        }
        setFilteredItems(items);
    }, [activeCategory, searchQuery, menuItems]);

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen bg-background text-foreground">

                {/* Menu Highlights Carousel */}
                {highlights.length > 0 && (
                    <section className="py-8 bg-muted/30">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold mb-4 px-2 font-playfair">Highlights</h2>

                            {/* Scroll Container with Snap */}
                            <div className="relative group">
                                <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-2">
                                    {highlights.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="flex-shrink-0 w-72 snap-center"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="bg-card rounded-2xl overflow-hidden shadow-md border border-border h-full flex flex-col">
                                                <div className="relative h-48">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                        <h3 className="text-white font-bold text-lg truncate">{item.name}</h3>
                                                        {item.price && <p className="text-yellow-400 font-semibold">{item.price}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background to-transparent w-12 h-full pointer-events-none md:hidden" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Scanned Menu Pages - Cinematic Presentation */}
                {scans.length > 0 && (
                    <section className="py-24 bg-background relative" id="all-dishes">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                                        <div className="h-[2px] w-8 bg-primary" />
                                        Traditional Touch
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black font-playfair text-foreground tracking-tighter">
                                        Browse our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Original Menu</span>
                                    </h2>
                                </div>
                                <p className="text-muted-foreground font-medium text-sm md:text-base mb-2">Experience the classic Milan feel. Tap to expand.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                                {scans.map((scan, index) => (
                                    <motion.div
                                        key={scan.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        whileHover={{ y: -10 }}
                                        className="cursor-pointer group relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 aspect-[3.5/5] bg-neutral-900"
                                        onClick={() => setSelectedScan(scan)}
                                    >
                                        <img
                                            src={scan.image}
                                            alt={scan.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        />

                                        {/* Overlay Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity z-10" />

                                        {/* Content Layer */}
                                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 translate-y-3 group-hover:translate-y-0 transition-transform">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-[1px] w-4 bg-white/40 group-hover:w-8 transition-all" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Milan Classics</span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-black font-playfair text-white leading-tight mb-2">
                                                {scan.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ZoomIn className="h-3 w-3" /> Click to expand
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Premium Menu Header */}
                <section className="relative pt-32 pb-20 bg-gradient-to-br from-red-800 to-red-950 overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-100 text-xs font-black uppercase tracking-[0.2em] mb-6"
                        >
                            Delicious Excellence
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black font-playfair text-white mb-6 drop-shadow-xl">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-300">Signature</span> Menu
                        </h1>
                        <p className="text-lg md:text-xl text-red-100/80 max-w-2xl mx-auto font-light mb-12">
                            Indulge in a curated selection of authentic flavors, prepared with the finest ingredients and a dash of tradition.
                        </p>

                        {/* Search Bar - Premium Glass UI */}
                        <div className="max-w-md mx-auto relative group">
                            <input
                                type="text"
                                placeholder="Craving something specific?"
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/40 px-6 py-4 rounded-3xl outline-none focus:ring-4 focus:ring-yellow-500/20 transition-all text-lg shadow-2xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-yellow-500 rounded-2xl flex items-center justify-center text-red-950 shadow-lg group-hover:scale-110 transition-transform">
                                <Search className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Dishes Section - Enhanced UI */}
                {menuItems.filter(i => i.isFeatured).length > 0 && (
                    <section className="py-24 bg-card/30 backdrop-blur-sm relative overflow-hidden">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row items-baseline gap-4 mb-12">
                                <h2 className="text-4xl font-black font-playfair text-gray-900 uppercase tracking-tighter">Chef's Recommendations</h2>
                                <div className="h-1 flex-1 bg-gradient-to-r from-red-600/20 to-transparent rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {menuItems.filter(i => i.isFeatured).slice(0, 4).map(item => (
                                    <DishCard key={item.id} dish={item} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Detailed Menu Section with Sticky Navigation */}
                <section className="py-20 bg-gray-50/50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Elegant Category Sidebar */}
                            <div className="lg:w-72 space-y-4 lg:sticky lg:top-28 h-fit">
                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Refine Menu</h3>
                                    <div className="space-y-1">
                                        {dynamicCategories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
                                                    activeCategory === category
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                )}
                                            >
                                                {category}
                                                {activeCategory === category && <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 relative overflow-hidden">
                                {/* Decorative Blur */}
                                <div className="absolute -top-4 -right-4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                                {/* Search & Results Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                    <div className="relative flex-1 max-w-md group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Search for dishes..."
                                            className="pl-12 h-14 rounded-2xl bg-card border-none shadow-xl shadow-gray-200/20 dark:shadow-black/20 focus:ring-4 focus:ring-primary/10 transition-all text-base hover:shadow-2xl"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-xl shadow-sm border border-border/50">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Displaying {filteredItems.length} {filteredItems.length === 1 ? 'Dish' : 'Dishes'}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredItems.map((item) => (
                                        <DishCard key={item.id} dish={item} />
                                    ))}
                                    {filteredItems.length === 0 && (
                                        <div className="col-span-full bg-card/50 backdrop-blur-md rounded-[3rem] p-20 text-center border border-dashed border-border/50">
                                            <div className="bg-muted h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🍽️</div>
                                            <h3 className="text-2xl font-black text-foreground mb-2">No dishes found</h3>
                                            <p className="text-muted-foreground mb-8">Try adjusting your search or category filters.</p>
                                            <Button
                                                variant="outline"
                                                className="rounded-2xl"
                                                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                                            >
                                                Show All Dishes
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <StickyBottomBar />
            <WhatsAppButton />

            {/* Lightbox for Menu Scans */}
            <AnimatePresence>
                {selectedscan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedScan(null)}
                    >
                        <button className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                            <X className="h-8 w-8" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={selectedscan.image} // Note: This assumes image URL is valid public URL
                            alt={selectedscan.title}
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                            <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                                {selectedscan.title}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
