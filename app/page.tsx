"use client";

import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyBottomBar } from "@/components/StickyBottomBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { DishCard } from "@/components/DishCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Kept imports
import { useToast } from "@/components/ui/toast";
import { storage } from "@/lib/storage";
import { MenuItem, Review } from "@/lib/types";
import { Star, Users, Leaf, Zap, MessageCircle, MapPin, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [featuredDishes, setFeaturedDishes] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [makranaImages, setMakranaImages] = useState<string[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentMakranaIndex, setCurrentMakranaIndex] = useState(0);
  const [cuisineType, setCuisineType] = useState("North");

  const { showToast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load Data Async
  useEffect(() => {
    const loadData = async () => {
      try {
        const menu = await storage.getMenu();
        setFeaturedDishes(menu.filter((item) => item.isFeatured).slice(0, 6));

        const revs = await storage.getReviews();
        setReviews(revs);

        const heroes = await storage.getHeroImages();
        if (heroes.length > 0) setHeroImages(heroes.map(h => h.image_url));

        const makranas = await storage.getMakranaImages();
        if (makranas.length > 0) setMakranaImages(makranas.map(m => m.image_url));

        const showcase = await storage.getShowcaseImages();
        if (showcase.length > 0) {
          setGalleryPreview(showcase);
        } else {
          const gallery = await storage.getGallery();
          setGalleryPreview(gallery.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };
    loadData();
  }, []);

  // Cycle Hero Images (10s)
  useEffect(() => {
    if (heroImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentHeroIndex(prev => (prev + 1) % heroImages.length);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [heroImages]);

  // Cycle Makrana Images (10s)
  useEffect(() => {
    if (makranaImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentMakranaIndex(prev => (prev + 1) % makranaImages.length);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [makranaImages]);

  // Cycle Cuisine Text (2s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCuisineType(prev => prev === "North" ? "South" : "North");
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/917023232376?text=Hello Milan Restaurant...", "_blank");
  };

  const handleDirections = () => {
    window.open("https://maps.app.goo.gl/Gg0lOVNCUNe6xcjWO", "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-background text-foreground overflow-hidden">

        {/* Hero Section - Dynamic Background with Clean UI */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              {heroImages.length > 0 ? (
                <motion.div
                  key={currentHeroIndex}
                  initial={{ opacity: 0, scale: 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
                />
              ) : (
                /* Cinematic Mesh Gradient Fallback - Deep & Alive */
                <div className="absolute inset-0 bg-[#050505] overflow-hidden">
                  {/* Primary Glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.4, 1],
                      x: [0, 100, 0],
                      y: [0, 50, 0],
                      rotate: [0, 45, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-red-600/20 rounded-full blur-[120px]"
                  />
                  {/* Secondary Accent */}
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      x: [0, -100, 0],
                      y: [0, -50, 0],
                      rotate: [0, -45, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-orange-500/15 rounded-full blur-[120px]"
                  />
                  {/* Deep Center Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-red-900/10 to-transparent blur-[80px]" />

                  {/* Premium Texture Layer */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

                  {/* Floating Light Particles */}
                  <div className="absolute inset-0 z-10">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 0.4, 0],
                          scale: [0, 1, 0],
                          x: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
                          y: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
                        }}
                        transition={{
                          duration: 10 + Math.random() * 10,
                          repeat: Infinity,
                          delay: i * 2
                        }}
                        className="absolute h-1 w-1 bg-white rounded-full blur-[1px]"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 z-10" />
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl shadow-2xl"
                >
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Makrana's Finest Dining</span>
                </motion.div>

                <h1 className="text-6xl md:text-[8.5rem] font-black font-playfair text-white tracking-tighter leading-[0.85] mb-8 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  Milan <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/40">Restaurant</span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-3xl text-white/80 mb-14 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
                >
                  Experience the true essence of <span className="text-white border-b-2 border-primary/50 inline-flex items-center align-bottom mx-1">
                    Traditional
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={cuisineType}
                        initial={{ y: 5, opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 5, opacity: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="inline-block mx-2 text-red-400 font-bold min-w-[50px] text-center"
                      >
                        {cuisineType}
                      </motion.span>
                    </AnimatePresence>
                    Indian
                  </span> cuisine in the heart of the marble city.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-8 justify-center items-center"
                >
                  <Button size="lg" onClick={handleWhatsApp} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-14 h-16 text-xl font-bold shadow-[0_15px_30px_-5px_rgba(220,38,38,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group">
                    <MessageCircle className="h-6 w-6 mr-2 transition-transform group-hover:rotate-12" /> Order Now
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleDirections} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black rounded-2xl px-14 h-16 text-xl font-bold shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <MapPin className="h-6 w-6 mr-2" /> Visit Us
                  </Button>
                </motion.div>

                {/* Modern Image Nav */}
                {heroImages.length > 1 && (
                  <div className="flex justify-center gap-4 mt-20">
                    {heroImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentHeroIndex(i)}
                        className={cn(
                          "h-1 transition-all duration-700 rounded-full",
                          currentHeroIndex === i ? "w-16 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" : "w-6 bg-white/20 hover:bg-white/40"
                        )}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Luxury Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex flex-col items-center gap-4">
              <span className="text-[9px] uppercase tracking-[0.6em] text-white/30 font-black">Scroll to Explore</span>
              <div className="h-12 w-[1px] bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-16 -mt-16 relative z-30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: Star, title: "4.3 Rating", sub: "Loved by City", color: "text-yellow-500", bg: "bg-yellow-50" },
                { icon: Leaf, title: "Pure Veg", sub: "Available", color: "text-green-500", bg: "bg-green-50" },
                { icon: Users, title: "Family", sub: "Friendly", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Zap, title: "Fast", sub: "Service", color: "text-red-500", bg: "bg-red-50" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "bg-card p-6 md:p-8 rounded-3xl shadow-xl border border-border text-center transform transition-all hover:-translate-y-2 hover:shadow-2xl",
                    "dark:bg-card dark:border-border"
                  )}
                >
                  <f.icon className={cn("h-12 w-12 mx-auto mb-4", f.color)} />
                  <h3 className="font-bold text-xl mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{f.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Dishes Carousel */}
        <section className="py-24 bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full">Customer Favorites</span>
                <h2 className="text-4xl md:text-5xl font-bold font-playfair mt-4">Popular Dishes</h2>
              </div>
              <div className="flex gap-3">
                <button onClick={() => scrollCarousel("left")} className="p-4 rounded-full border border-border bg-background hover:bg-muted transition-all active:scale-95 shadow-sm"><ChevronLeft className="h-6 w-6" /></button>
                <button onClick={() => scrollCarousel("right")} className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-lg hover:shadow-primary/25"><ChevronRight className="h-6 w-6" /></button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto pb-16 snap-x snap-mandatory scrollbar-hide px-2"
              style={{ scrollBehavior: "smooth" }}
            >
              {featuredDishes.length > 0 ? featuredDishes.map((dish) => (
                <motion.div
                  key={dish.id}
                  className="min-w-[300px] md:min-w-[340px] snap-center"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <DishCard dish={dish} />
                </motion.div>
              )) : (
                <div className="w-full text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground text-lg">No popular dishes marked yet. Check Admin Panel.</p>
                </div>
              )}

              {featuredDishes.length > 0 && (
                <div className="min-w-[200px] flex items-center justify-center snap-center">
                  <Link href="/menu" className="group flex flex-col items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-20 h-20 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                      <ChevronRight className="h-10 w-10" />
                    </div>
                    <span className="font-bold text-xl">View Full Menu</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-24 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-primary font-bold opacity-80 tracking-widest uppercase text-sm">TESTIMONIALS</span>
              <h2 className="text-4xl md:text-5xl font-bold font-playfair mt-4">What Makrana Says</h2>
            </div>
            <ReviewsSection initialReviews={reviews} />
            <div className="mt-16 max-w-xl mx-auto">
              <div className="bg-card p-8 rounded-3xl shadow-lg border border-border">
                <h3 className="text-2xl font-bold mb-6 text-center">Share Your Experience</h3>
                <ReviewForm onSuccess={async () => {
                  const updated = await storage.getReviews();
                  setReviews(updated);
                  showToast("Review submitted for approval!", "success");
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* I Love Makrana Banner - Signature Premium Feature */}
        <div className="relative h-72 md:h-96 bg-[#990000] text-white overflow-hidden flex items-center justify-center shadow-2xl z-20">
          {/* Deep Mesh Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/30 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-black/40 to-transparent" />
            <AnimatePresence mode="wait">
              {makranaImages.length > 0 ? (
                <motion.div
                  key={currentMakranaIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${makranaImages[currentMakranaIndex]})` }}
                />
              ) : (
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              )}
            </AnimatePresence>
          </div>

          {/* Floating Particles for Life */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: [0, -100],
                  x: [0, (i % 2 === 0 ? 30 : -30)]
                }}
                transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: i * 0.5 }}
                className="absolute h-1 w-1 bg-red-400 rounded-full blur-[1px]"
                style={{ left: `${10 + i * 10}%`, bottom: "20%" }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center px-12 py-10 glass-dark rounded-[3rem] border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-center gap-6 mb-4">
              <span className="text-5xl md:text-8xl font-black font-playfair tracking-tighter">I</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              >
                <Heart className="h-16 w-16 md:h-28 md:w-28 text-red-500 fill-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]" />
              </motion.div>
              <span className="text-5xl md:text-8xl font-black font-playfair tracking-tighter">Makrana</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-12 bg-white/20" />
              <p className="text-sm md:text-lg font-bold uppercase tracking-[0.5em] text-white/70">Heart of the City</p>
              <div className="h-[2px] w-12 bg-white/20" />
            </div>
          </motion.div>
        </div>

        {/* Home Gallery Preview - Showcase Section */}
        <section className="py-32 bg-background relative overflow-hidden transition-colors duration-700">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">
                  <div className="h-[2px] w-12 bg-primary" />
                  Visual Masterpieces
                </div>
                <h2 className="text-5xl md:text-8xl font-black font-playfair text-foreground tracking-tighter leading-[0.9]">
                  Capturing the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Milan Soul</span>
                </h2>
                <p className="text-muted-foreground mt-8 text-xl font-medium max-w-lg leading-relaxed">
                  A curation of culinary excellence and soulful moments, captured within the marble walls of Makrana.
                </p>
              </div>
              <Link href="/gallery">
                <Button className="bg-foreground text-background hover:bg-primary hover:text-white h-20 px-12 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 group transition-all shadow-2xl">
                  Explore Full Lookbook
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                whileHover={{ y: -15, scale: 1.02 }}
                className="col-span-2 row-span-2 group relative overflow-hidden rounded-[3.5rem] aspect-square shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-border/50 bg-card"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors z-10 duration-500" />
                <img
                  src={galleryPreview[0]?.url || "https://vxxoaxdpwzeqoxxkzujh.supabase.co/storage/v1/object/public/images/1739300649713-6.jpg"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Milan Ambiance"
                />
                <div className="absolute bottom-12 left-12 z-20 text-white">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-3">Signature Vibe</div>
                  <div className="text-4xl md:text-5xl font-black font-playfair leading-tight drop-shadow-2xl">Tradition Meets <br /> Modern Luxury</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[3rem] aspect-square shadow-2xl border border-border/50 mt-12 bg-card"
              >
                <img
                  src={galleryPreview[1]?.url || "https://vxxoaxdpwzeqoxxkzujh.supabase.co/storage/v1/object/public/images/1739300632314-1.jpg"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Culinary Detail"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[3rem] aspect-square shadow-2xl border border-border/50 bg-card"
              >
                <img
                  src={galleryPreview[2]?.url || "https://vxxoaxdpwzeqoxxkzujh.supabase.co/storage/v1/object/public/images/1739300644342-4.jpg"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Flavorful Moments"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[3rem] aspect-[3/4] shadow-2xl border border-border/50 -mt-20 lg:col-start-3 bg-card"
              >
                <img
                  src={galleryPreview[3]?.url || "https://vxxoaxdpwzeqoxxkzujh.supabase.co/storage/v1/object/public/images/1739300638531-3.jpg"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Chef's Special"
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[3rem] aspect-square shadow-2xl border border-border/50 lg:col-start-4 bg-card"
              >
                <img
                  src={galleryPreview[4]?.url || "https://vxxoaxdpwzeqoxxkzujh.supabase.co/storage/v1/object/public/images/1739302660001-gallery-image.jpg"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Atmospheric Moments"
                />
              </motion.div>
            </div>
          </div>
        </section>

      </main >

      <Footer />
      <StickyBottomBar />
      <WhatsAppButton />
    </>
  );
}
