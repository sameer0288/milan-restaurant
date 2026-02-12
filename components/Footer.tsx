"use client";

import { MapPin, Phone, Clock, Facebook, Instagram, Star, Heart } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="relative bg-[#080808] pt-32 pb-24 md:pb-12 overflow-hidden text-white">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none -mr-96 -mt-96 opacity-50" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none -ml-96 -mb-96 opacity-30" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand & Story: Cinematic Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <div>
                            <Logo className="mb-10 !px-0 scale-[1.35] origin-left" light />
                            <p className="text-white/60 text-lg leading-relaxed font-bold max-w-sm mt-8">
                                "Legendary culinary masterpieces, crafted with passion in the heart of Makrana since generations. Where every flavor tells a story."
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Verified Excellence</span>
                            <div className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 w-fit shadow-2xl">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className={`h-5 w-5 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`} />
                                    ))}
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <span className="text-xl font-black tracking-tighter text-white">4.3 <span className="text-sm text-white/40 font-bold">Rating</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">The Journey</h3>
                                <ul className="space-y-5">
                                    {[
                                        { name: "Signature Menu", href: "/menu" },
                                        { name: "Visual Lookbook", href: "/gallery" },
                                        { name: "Our Heritage", href: "/about" },
                                        { name: "Customer Reviews", href: "/reviews" }
                                    ].map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-sm font-bold text-white/60 hover:text-primary transition-all flex items-center gap-3 group">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-125 transition-all" />
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">Contact Node</h3>
                                <ul className="space-y-8">
                                    <li className="group">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3 ml-7">Location</p>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-4 w-4 text-primary mt-1" />
                                            <span className="text-sm font-bold text-white/80 transition-colors group-hover:text-primary leading-snug">
                                                Bay Pass Teeraha, Manglana Rd,<br />Makrana, Rajasthan 341505
                                            </span>
                                        </div>
                                    </li>
                                    <li className="group">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3 ml-7">Direct Line</p>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <a href="tel:+917023232376" className="text-sm font-black tracking-tight text-white group-hover:text-primary transition-colors">
                                                +91 70232 32376
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Social Concierge */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group backdrop-blur-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 relative z-10">Social Concierge</h3>
                            <div className="flex items-center gap-4 relative z-10">
                                <a href="https://www.facebook.com/milansweetsmakrana/" target="_blank" className="h-14 w-14 rounded-2xl bg-[#121212] hover:bg-primary text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl">
                                    <Facebook className="h-6 w-6" />
                                </a>
                                <a href="#" className="h-14 w-14 rounded-2xl bg-[#121212] hover:bg-primary text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl">
                                    <Instagram className="h-6 w-6" />
                                </a>
                            </div>
                            <div className="mt-8 relative z-10">
                                <p className="text-[10px] font-black text-white/40 leading-relaxed uppercase tracking-widest">Join our digital family for daily culinary updates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom: The Signature */}
                <div className="border-t border-white/5 pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-3">
                            Designed with <Heart className="h-4 w-4 text-red-600 fill-red-600 animate-pulse" /> in Makrana
                        </p>
                        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                            &copy; {new Date().getFullYear()} Milan Restaurant. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
                        <Clock className="h-3 w-3 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Open Daily: 11:00 AM - 11:00 PM</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
