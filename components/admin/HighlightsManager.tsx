"use client";

import { useState, useEffect } from "react";
import { MenuHighlight } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Edit, X } from "lucide-react";

export function HighlightsManager() {
    const [highlights, setHighlights] = useState<MenuHighlight[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", price: "", image: "" });
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await storage.getHighlights();
            setHighlights(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load highlights", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            if (editingId) {
                await storage.updateHighlight(editingId, {
                    name: formData.name,
                    price: formData.price,
                    image: formData.image
                });
                showToast("Highlight updated", "success");
            } else {
                await storage.addHighlight({
                    name: formData.name,
                    price: formData.price,
                    image: formData.image
                });
                showToast("Highlight added", "success");
            }
            loadData();
            resetForm();
        } catch (error) {
            console.error(error);
            showToast("Operation failed", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this highlight?")) {
            try {
                await storage.deleteHighlight(id);
                loadData();
                showToast("Highlight deleted", "success");
            } catch (error) {
                console.error(error);
                showToast("Delete failed", "error");
            }
        }
    };

    const handleEdit = (item: MenuHighlight) => {
        setFormData({ name: item.name, price: item.price || "", image: item.image || "" });
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", price: "", image: "" });
        setEditingId(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Menu Highlights</h3>
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Highlight
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlights.map(item => (
                    <div key={item.id} className="relative group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full bg-muted">
                            <img src={item.image || "/images/placeholder-food.jpg"} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <div className="font-bold text-lg">{item.name}</div>
                            <div className="text-muted-foreground">{item.price}</div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-blue-600">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl p-6 max-w-md w-full shadow-2xl border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">{editingId ? "Edit" : "Add"} Highlight</h3>
                            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Name</label>
                                <Input placeholder="Name (e.g. Special Thali)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Price</label>
                                <Input placeholder="Price (e.g. ₹120)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Image</label>
                                <ImageUploader value={formData.image} onChange={v => setFormData({ ...formData, image: v })} onRemove={() => setFormData({ ...formData, image: "" })} />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit">{editingId ? "Update" : "Save"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
