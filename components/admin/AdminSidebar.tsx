"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UtensilsCrossed,
    Image as ImageIcon,
    Settings,
    MessageSquare,
    LogOut,
    Star,
    Package,
    ReceiptIndianRupee, // For Udhar
    ExternalLink,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AdminSidebarProps {
    onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/menu", label: "Menu Manager", icon: UtensilsCrossed },
        { href: "/admin/stock", label: "Stock Manager", icon: Package },
        { href: "/admin/udhar", label: "Udhar Book", icon: ReceiptIndianRupee },
        { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
        { href: "/admin/messages", label: "Messages", icon: MessageSquare },
        { href: "/admin/reviews", label: "Reviews", icon: Star },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-full h-full bg-card/50 backdrop-blur-xl flex flex-col border-r border-border/50">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">M</div>
                    <h1 className="text-2xl font-black font-playfair tracking-tighter">Milan<span className="text-primary font-bold">Admin</span></h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Online</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 px-6 overflow-y-auto scrollbar-hide">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary text-white font-bold shadow-xl shadow-primary/20 scale-[1.02]"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", isActive && "text-white")} />
                            <span className="text-[13px] tracking-tight">{link.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute right-3 h-1.5 w-1.5 bg-white rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto space-y-3">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all font-bold text-xs group"
                >
                    <span className="flex items-center gap-3">
                        <ExternalLink className="h-4 w-4" />
                        Live Site
                    </span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>

                <button
                    onClick={onLogout}
                    className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-muted-foreground hover:bg-red-600/10 hover:text-red-600 transition-all font-bold text-xs group"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
