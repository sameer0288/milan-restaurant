"use client";

import { useState, useEffect } from "react";
import { MenuScan } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Edit, X, Image as ImageIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScansManager() {
    const [scans, setScans] = useState<MenuScan[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", order: 1, image: "" });
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await storage.getScans();
            setScans(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
            console.error(error);
            showToast("Failed to load scans", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        try {
            if (editingId) {
                await storage.updateScan(editingId, {
                    title: formData.title,
                    order: formData.order,
                    image: formData.image
                });
                showToast("Menu Scan updated", "success");
            } else {
                await storage.addScan({
                    title: formData.title,
                    order: formData.order,
                    image: formData.image
                });
                showToast("Menu Scan added", "success");
            }
            loadData();
            resetForm();
        } catch (error) {
            console.error(error);
            showToast("Operation failed", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this menu scan?")) {
            try {
                await storage.deleteScan(id);
                loadData();
                showToast("Menu Scan deleted", "success");
            } catch (error) {
                console.error(error);
                showToast("Delete failed", "error");
            }
        }
    };

    const handleEdit = (item: MenuScan) => {
        setFormData({ title: item.title, order: item.order || 1, image: item.image || "" });
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({ title: "", order: scans.length + 1, image: "" });
        setEditingId(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 glass-panel rounded-[2rem] gap-4">
                <div>
                    <h3 className="text-2xl font-black font-playfair tracking-tight">Digital Menu Card</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Manage scanned menu pages</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="gap-3 h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-transform">
                    <Plus className="h-5 w-5" />
                    <span className="font-bold">Add New Scan</span>
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {scans.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative bg-card border border-border/50 rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    >
                        <div className="aspect-[3.5/5] overflow-hidden rounded-2xl bg-muted relative">
                            {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                    <ImageIcon className="h-20 w-20" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3 flex">
                                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10">Page {item.order}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-center gap-1">
                            <p className="font-bold text-sm tracking-tight truncate max-w-full">{item.title}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-background rounded-[3rem] p-8 max-w-md w-full shadow-2xl border border-border relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black font-playfair tracking-tight">{editingId ? "Edit" : "New"} Menu Scan</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Upload high quality scans</p>
                            </div>
                            <button onClick={resetForm} className="p-3 bg-muted hover:bg-accent rounded-2xl transition-colors"><X className="h-5 w-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Scan Title</label>
                                <Input className="h-12 rounded-2xl bg-muted/50 border-none" placeholder="e.g. Traditional Specialties" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Sort Order</label>
                                <Input className="h-12 rounded-2xl bg-muted/50 border-none" type="number" placeholder="1" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Photo / Scan File</label>
                                <div className="rounded-[2rem] overflow-hidden border-2 border-dashed border-muted p-2">
                                    <ImageUploader value={formData.image} onChange={v => setFormData({ ...formData, image: v })} onRemove={() => setFormData({ ...formData, image: "" })} />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-6">
                                <Button type="button" variant="ghost" onClick={resetForm} className="h-12 px-6 rounded-2xl font-bold">Cancel</Button>
                                <Button type="submit" className="h-12 px-8 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform">{editingId ? "Update Scan" : "Save Page"}</Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
