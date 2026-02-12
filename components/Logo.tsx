"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
    className?: string;
    showText?: boolean;
    light?: boolean;
}

export function Logo({ className, showText = true, light = false }: LogoProps) {
    const [logo, setLogo] = useState<string>("");

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const url = await storage.getLogo();
                setLogo(url);
            } catch (err) {
                console.error("Logo fetch failed", err);
            }
        };
        fetchLogo();

        window.addEventListener("logo-update", fetchLogo);
        return () => window.removeEventListener("logo-update", fetchLogo);
    }, []);

    return (
        <div className={cn("flex items-center gap-3 group px-1 py-1 rounded-xl transition-all duration-500", className)}>
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-md bg-gradient-to-br from-red-600 to-red-800 transform group-hover:scale-105 transition-all duration-500">
                {logo ? (
                    <img
                        src={logo}
                        alt="Milan Logo"
                        className="h-full w-full object-contain p-1 drop-shadow-sm"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary text-white font-black text-2xl font-playfair shadow-inner">
                        M
                    </div>
                )}
            </div>
            {showText && (
                <div className="flex flex-col -space-y-1">
                    <span className={cn(
                        "font-black text-2xl tracking-tighter font-playfair transition-colors duration-500",
                        light ? "text-white" : "text-gray-900 group-hover:text-primary"
                    )}>
                        Milan
                    </span>
                    <span className={cn(
                        "font-bold text-[10px] uppercase tracking-[0.3em] transition-opacity duration-500",
                        light ? "text-white/60" : "text-primary/70 group-hover:text-primary"
                    )}>
                        Restaurant
                    </span>
                </div>
            )}
        </div>
    );
}
