"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { storage } from "@/lib/storage";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { ShieldAlert, Fingerprint } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        if (sessionStorage.getItem("isAdmin") === "true") {
            router.push("/admin");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const normalizedUsername = username.trim().toLowerCase();
            const normalizedPassword = password.trim();

            if (normalizedUsername === "admin" && await storage.verifyAdmin(normalizedPassword)) {
                sessionStorage.setItem("isAdmin", "true");
                showToast("Login Successful", "success");
                router.push("/admin");
            } else {
                showToast("Invalid Credentials", "error");
            }
        } catch (err) {
            showToast("Login Failed", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[160px]"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.2, 0.3, 0.2],
                        x: [0, -40, 0],
                        y: [0, 60, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[160px]"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                    <div className="text-center mb-14 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(220,38,38,0.3)] relative"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-[2.5rem] animate-pulse" />
                            <ShieldAlert className="h-10 w-10 text-white relative z-10" />
                        </motion.div>

                        <h1 className="text-5xl font-black font-playfair text-white tracking-tighter mb-3 leading-none italic">
                            Admin <span className="text-primary not-italic">Login</span>
                        </h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.6em] text-white/30 border-t border-white/5 pt-4 inline-block mx-auto">
                            Secure Access
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 ml-2">Username</label>
                            <div className="relative group/input">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within/input:text-primary transition-all duration-300" />
                                <Input
                                    type="text"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-16 pl-16 bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 rounded-2xl focus:bg-white/[0.07] focus:border-primary/40 focus:ring-0 transition-all text-sm font-black tracking-widest uppercase"
                                    required
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck="false"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <label className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 ml-2">Password</label>
                            <div className="relative group/input">
                                <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within/input:text-primary transition-all duration-300" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-16 pl-16 bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 rounded-2xl focus:bg-white/[0.07] focus:border-primary/40 focus:ring-0 transition-all text-xl font-black"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                type="submit"
                                className="w-full h-16 rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(220,38,38,0.2)] hover:shadow-[0_25px_60px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 border border-white/10"
                            >
                                Login
                            </Button>
                        </motion.div>
                    </form>

                    <div className="mt-14 p-6 bg-black/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md relative z-10 group/status">
                        <div className="flex items-center gap-5">
                            <div className="h-10 w-10 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-500 flex-shrink-0 animate-pulse border border-orange-500/20">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="text-[9px] font-black text-white/20 leading-loose uppercase tracking-[0.3em] transition-colors group-hover/status:text-white/40">
                                Protected Area<br />
                                Authorized Personnel Only
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12 space-y-4"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">
                        &copy; {new Date().getFullYear()} Milan Restaurant Admin
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
