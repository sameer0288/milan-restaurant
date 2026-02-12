"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/admin/login") return;

        const isAuth = sessionStorage.getItem("isAdmin") === "true";
        if (!isAuth) {
            router.push("/admin/login");
        }
    }, [router, pathname]);

    const handleLogout = () => {
        sessionStorage.removeItem("isAdmin");
        router.push("/admin/login");
    };

    // Close sidebar on path change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-background transition-colors duration-500">
            {/* Desktop Sidebar Overlay (Fixed) */}
            <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="fixed inset-y-0 left-0 w-72">
                    <AdminSidebar onLogout={handleLogout} />
                </div>
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-slate-950 z-[101] lg:hidden"
                        >
                            <div className="absolute top-6 right-6 lg:hidden">
                                <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <AdminSidebar onLogout={handleLogout} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Top Header - Cinematic & Responsive */}
                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40 px-6 lg:px-12 h-20 flex items-center justify-between transition-all duration-300">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-3 bg-secondary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <h2 className="text-xl font-black font-playfair tracking-tight text-foreground">
                                    {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                                </h2>
                            </div>
                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-muted-foreground/60 ml-3.5">System Administrator Console</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl border border-border/40">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Master Node Active</span>
                        </div>
                        <ThemeToggle />
                        <div className="h-6 w-[1px] bg-border/60 mx-2 hidden sm:block" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group"
                        >
                            <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            <span className="hidden sm:inline">Terminate Session</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-14 animate-in fade-in duration-700 max-w-[1920px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
