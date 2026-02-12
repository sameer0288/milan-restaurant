"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { StaffMember } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
    MessageSquare,
    Star,
    UtensilsCrossed,
    Users,
    Plus,
    Trash2,
    Calendar,
    Phone,
    FileText,
    CreditCard,
    Settings,
    Heart,
    RefreshCw
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const router = useRouter();
    const { showToast } = useToast();
    const [stats, setStats] = useState({
        dishes: 0,
        reviews: 0,
        messages: 0,
        staff: 0,
        totalLikes: 0
    });
    const [schemaHealth, setSchemaHealth] = useState({
        galleryLikesMissing: false
    });

    // Staff State
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [showStaffForm, setShowStaffForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: "",
        role: "",
        phone: "",
        email: "",
        aadhar: "",
        dateOfJoining: "",
        image: ""
    });

    useEffect(() => {
        // Auth Check
        const isAuth = sessionStorage.getItem("isAdmin") === "true";
        if (!isAuth) {
            router.push("/admin/login");
        } else {
            loadDashboardData();
        }
    }, []);

    const loadDashboardData = async () => {
        try {
            // Parallel fetching for speed
            const [menu, reviews, messages, staff, gallery] = await Promise.all([
                storage.getMenu(),
                storage.getReviews(),
                storage.getMessages(),
                storage.getStaff(),
                storage.getGallery()
            ]);

            const totalLikes = gallery.reduce((acc, current) => acc + (current.likes || 0), 0);

            setStats({
                dishes: menu.length,
                reviews: reviews.length,
                messages: messages.length,
                staff: staff.length,
                totalLikes: totalLikes
            });
            setStaffList(staff);

            // Schema Health Check
            if (gallery.length > 0 && gallery[0].likes === undefined) {
                setSchemaHealth({ galleryLikesMissing: true });
            }
        } catch (error: any) {
            console.error("Dashboard Load Error:", error);
            if (error?.message?.includes("column gallery.likes")) {
                setSchemaHealth({ galleryLikesMissing: true });
            }
            showToast("Failed to refresh data", "error");
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await storage.addStaff(newStaff);
            showToast("Staff member added successfully", "success");
            setShowStaffForm(false);
            setNewStaff({ name: "", role: "", phone: "", email: "", aadhar: "", dateOfJoining: "", image: "" });
            loadDashboardData();
        } catch (error) {
            console.error(error);
            showToast("Failed to add staff", "error");
        } finally {
            setFormLoading(false);
        }
    };

    const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);

    const handleDeleteStaff = async (id: string) => {
        try {
            await storage.deleteStaff(id);
            showToast("Staff member removed", "success");
            loadDashboardData();
        } catch (error) {
            console.error(error);
            showToast("Failed to delete staff", "error");
        }
    };

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to remove this staff member? This action cannot be undone."
                onConfirm={() => confirmDelete && handleDeleteStaff(confirmDelete.id)}
                onCancel={() => setConfirmDelete(null)}
                confirmLabel="Delete"
            />
            <div className="flex flex-col md:flex-row justify-between items-center p-12 glass-panel rounded-[3.5rem] gap-8 relative overflow-hidden group border-border/40">
                <div className="relative z-10 space-y-2">
                    <h1 className="text-4xl md:text-6xl font-black font-playfair tracking-tight text-foreground leading-tight">
                        Dashboard <br /> Overview
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.4em]">
                            System Online
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4">
                    <Button
                        onClick={loadDashboardData}
                        variant="outline"
                        className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Data
                    </Button>
                </div>

                {/* Decorative background element */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            </div>

            {/* KPI Cards Grid - Cinematic Scale */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {[
                    { label: "Menu Items", value: stats.dishes, sub: "Total Dishes", icon: UtensilsCrossed, color: "from-orange-500/20 to-red-500/20", text: "text-orange-500" },
                    { label: "Reviews", value: stats.reviews, sub: "Verified Reviews", icon: Star, color: "from-yellow-400/20 to-orange-400/20", text: "text-yellow-500" },
                    { label: "Gallery Likes", value: stats.totalLikes, sub: "Total Likes", icon: Heart, color: "from-pink-500/20 to-rose-500/20", text: "text-rose-500", action: () => router.push("/admin/gallery") },
                    { label: "Messages", value: stats.messages, sub: "Inquiries", icon: MessageSquare, color: "from-purple-500/20 to-indigo-500/20", text: "text-purple-500" },
                    { label: "Staff", value: stats.staff, sub: "Active Members", icon: Users, color: "from-blue-500/20 to-cyan-500/20", text: "text-blue-500" },
                    { label: "Settings", value: "Config", sub: "System", icon: Settings, color: "from-emerald-500/20 to-teal-500/20", text: "text-emerald-500", action: () => router.push("/admin/settings") }
                ].map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={kpi.action}
                        className={cn(
                            "group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-6 hover:shadow-2xl transition-all duration-500",
                            kpi.action && "cursor-pointer active:scale-95"
                        )}
                    >
                        <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] -mr-16 -mt-16 bg-gradient-to-br opacity-50", kpi.color)} />

                        <div className="relative z-10">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 border border-border/50 bg-background/50 backdrop-blur-md", kpi.text)}>
                                <kpi.icon className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                                <div className="text-3xl font-black tracking-tighter text-foreground">{kpi.value}</div>
                                <p className="text-[10px] font-bold text-muted-foreground/60">{kpi.sub}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Staff Management Section */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-1 relative">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black font-playfair">Staff Management</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manage your team members</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowStaffForm(!showStaffForm)}
                        className={cn(
                            "h-14 px-8 rounded-2xl font-black text-sm transition-all shadow-xl",
                            showStaffForm ? "bg-red-500 text-white shadow-red-500/20" : "bg-primary text-white shadow-primary/20"
                        )}
                    >
                        {showStaffForm ? "Cancel" : <><Plus className="h-5 w-5 mr-2" /> Add Staff</>}
                    </Button>
                </div>

                <AnimatePresence>
                    {showStaffForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                                <CardContent className="p-10">
                                    <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                            <Input required className="h-14 rounded-2xl bg-background border-none shadow-inner" placeholder="Ex. Rahul Kumar" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Role</label>
                                            <Input required className="h-14 rounded-2xl bg-background border-none shadow-inner" placeholder="Ex. Head Chef" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                                            <Input required className="h-14 rounded-2xl bg-background border-none shadow-inner" placeholder="+91 00000 00000" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                            <Input className="h-14 rounded-2xl bg-background border-none shadow-inner" placeholder="rahul@milan.com" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Aadhar Number</label>
                                            <Input required className="h-14 rounded-2xl bg-background border-none shadow-inner" placeholder="XXXX XXXX XXXX" value={newStaff.aadhar} onChange={e => setNewStaff({ ...newStaff, aadhar: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Date of Joining</label>
                                            <Input required type="date" className="h-14 rounded-2xl bg-background border-none shadow-inner" value={newStaff.dateOfJoining} onChange={e => setNewStaff({ ...newStaff, dateOfJoining: e.target.value })} />
                                        </div>
                                        <div className="lg:col-span-3 space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Photo</label>
                                            <div className="rounded-3xl overflow-hidden border-2 border-dashed border-primary/20 bg-background/50 p-4">
                                                <ImageUploader value={newStaff.image} onChange={v => setNewStaff({ ...newStaff, image: v })} onRemove={() => setNewStaff({ ...newStaff, image: "" })} />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-3 pt-4">
                                            <Button type="submit" className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={formLoading}>
                                                {formLoading ? "Adding..." : "Add Staff Member"}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Staff List Grid Cluster */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {staffList.length > 0 ? (
                        staffList.map((staff, idx) => (
                            <motion.div
                                key={staff.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-card rounded-[2.5rem] p-6 border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                            >
                                {/* Background ID badge effect */}
                                <div className="absolute -top-10 -right-10 text-[10rem] font-black text-muted/5 select-none pointer-events-none group-hover:text-primary/5 transition-colors">
                                    0{idx + 1}
                                </div>

                                <div className="relative z-10 flex gap-6">
                                    <div className="h-28 w-28 rounded-3xl bg-muted/50 flex-shrink-0 overflow-hidden border-4 border-background shadow-xl">
                                        {staff.image ? (
                                            <img src={staff.image} alt={staff.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/20 bg-background">
                                                <Users className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="font-black text-xl truncate text-foreground leading-tight">{staff.name}</h3>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mt-2 w-fit">
                                            {staff.role}
                                        </div>

                                        <div className="mt-4 space-y-1.5 opacity-60">
                                            <p className="flex items-center gap-2 text-[10px] font-bold"><Phone className="h-3 w-3 text-primary" /> {staff.phone}</p>
                                            <p className="flex items-center gap-2 text-[10px] font-bold"><CreditCard className="h-3 w-3 text-primary" /> {staff.aadhar.replace(/(\d{4})/g, '$1 ').trim()}</p>
                                            <p className="flex items-center gap-2 text-[10px] font-bold"><Calendar className="h-3 w-3 text-primary" /> Joined {staff.dateOfJoining}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setConfirmDelete({ id: staff.id })}
                                    className="absolute bottom-6 right-6 h-10 w-10 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 glass-panel rounded-[3rem] text-center border-dashed">
                            <Users className="h-20 w-20 mx-auto mb-6 opacity-5 animate-pulse" />
                            <h3 className="text-xl font-black font-playfair mb-2">No Staff Members</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Add your first staff member to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Operations Summary - Simple & Strong */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Settings className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black font-playfair text-foreground">System Activity</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Recent Updates & Logs</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    <Card className="rounded-[4rem] border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl transition-all border">
                        <CardHeader className="p-12 pb-6 flex flex-row items-center justify-between border-b border-border/5">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-[0.5em] text-muted-foreground/60">Activity Log</CardTitle>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Latest platform events</p>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                All Systems Nominal
                            </div>
                        </CardHeader>
                        <CardContent className="p-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {[
                                    { date: "Live Now", action: "Data Updated", detail: "Dashboard data has been synchronized.", status: "ok" },
                                    { date: "Today", action: "Review Logged", detail: `${stats.reviews} guest experiences verified.`, status: "ok" },
                                    { date: "Today", action: "Admin Session", detail: "Authorized access to management console.", status: "warning" }
                                ].map((log, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-8 rounded-[3rem] bg-secondary/20 border border-border/10 hover:border-primary/20 transition-all group/card">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-muted-foreground/40 tracking-widest uppercase">{log.date}</span>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                log.status === "ok" ? "bg-emerald-500" : "bg-primary"
                                            )} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-md font-black uppercase tracking-widest text-foreground group-hover/card:text-primary transition-colors">{log.action}</p>
                                            <p className="text-xs font-bold text-muted-foreground/50 leading-relaxed">{log.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
