"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { MenuItem, MenuCategory } from "@/lib/types";
import { AdminTable } from "@/components/admin/AdminTable";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Plus, X, Leaf, LayoutGrid, Image as ImageIcon, UtensilsCrossed } from "lucide-react";
import { HighlightsManager } from "@/components/admin/HighlightsManager";
import { ScansManager } from "@/components/admin/ScansManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function AdminMenuPage() {
    const [activeTab, setActiveTab] = useState<"items" | "highlights" | "scans" | "gallery">("items");

    // Items Logic
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "Fast Food",
        isVeg: true,
        image: "",
        isFeatured: false,
    });
    const { showToast } = useToast();

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await storage.getMenu();
            setMenu(data);
        } catch (error) {
            console.error("Failed to load menu", error);
            showToast("Failed to load menu items", "error");
        }
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        try {
            if (editingItem) {
                await storage.updateDish(editingItem.id, {
                    ...formData,
                    price: parseFloat(formData.price),
                });
                showToast("Item updated", "success");
            } else {
                await storage.addDish({
                    ...formData,
                    price: parseFloat(formData.price),
                });
                showToast("Item added", "success");
            }
            resetForm();
            await loadMenu();
        } catch (error) {
            console.error(error);
            showToast("Failed to save item", "error");
        }
    };

    const handleEditItem = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price.toString(),
            category: item.category,
            isVeg: item.isVeg,
            image: item.image,
            isFeatured: item.isFeatured || false,
        });
        setIsFormOpen(true);
    };

    const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

    const handleDeleteItem = async (item: MenuItem) => {
        setConfirmDelete({ id: item.id, name: item.name });
    };

    const confirmDeletion = async () => {
        if (!confirmDelete) return;
        try {
            await storage.deleteDish(confirmDelete.id);
            showToast("Item deleted", "success");
            await loadMenu();
            setConfirmDelete(null);
        } catch (error) {
            console.error(error);
            showToast("Failed to delete item", "error");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            category: "Fast Food",
            isVeg: true,
            image: "",
            isFeatured: false,
        });
        setEditingItem(null);
        setIsFormOpen(false);
    };

    const columns = [
        { key: "name", label: "Dish Name" },
        { key: "price", label: "Price", render: (item: MenuItem) => `₹${item.price}` },
        { key: "category", label: "Category" },
        {
            key: "isVeg",
            label: "Type",
            render: (item: MenuItem) => (
                <span className="flex items-center gap-1">
                    {item.isVeg && <Leaf className="h-4 w-4 text-green-600" />}
                    {item.isVeg ? "Veg" : "Non-Veg"}
                </span>
            ),
        },
        {
            key: "isFeatured",
            label: "Featured",
            render: (item: MenuItem) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isFeatured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {item.isFeatured ? "Yes" : "No"}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Discard Culinary Asset"
                message={`Are you sure you want to permanently remove "${confirmDelete?.name}" from the active menu? This action cannot be undone.`}
                onConfirm={confirmDeletion}
                onCancel={() => setConfirmDelete(null)}
                confirmLabel="Secure Deletion"
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair mb-2">Menu Management</h1>
                    <p className="text-muted-foreground">Manage dishes, highlights, and menu scans.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("items")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "items" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <UtensilsCrossed className="h-4 w-4" /> Dishes
                    </button>
                    <button
                        onClick={() => setActiveTab("highlights")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "highlights" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <LayoutGrid className="h-4 w-4" /> Highlights
                    </button>
                    <button
                        onClick={() => setActiveTab("scans")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "scans" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <ImageIcon className="h-4 w-4" /> Scans
                    </button>
                    <button
                        onClick={() => setActiveTab("gallery")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "gallery" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <ImageIcon className="h-4 w-4" /> Gallery
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                {activeTab === "items" && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                                <Plus className="h-5 w-5" /> Add Dish
                            </Button>
                        </div>
                        <AdminTable
                            data={menu}
                            columns={columns}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                        />

                        {/* Add/Edit Modal for Items */}
                        {isFormOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                <div className="bg-background rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                                    <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
                                        <h2 className="text-xl font-bold">{editingItem ? "Edit Dish" : "Add Dish"}</h2>
                                        <button onClick={resetForm} className="p-2 hover:bg-accent rounded-lg"><X className="h-6 w-6" /></button>
                                    </div>
                                    <form onSubmit={handleItemSubmit} className="p-6 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1 block">Name</label>
                                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Paneer Tikka" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1 block">Price (₹)</label>
                                                <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required placeholder="e.g. 250" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Category</label>
                                            <Input
                                                list="menu-categories"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="Type or select a category"
                                                required
                                            />
                                            <datalist id="menu-categories">
                                                {Array.from(new Set(menu.map(item => item.category))).map(c => (
                                                    <option key={c} value={c} />
                                                ))}
                                                <option value="Fast Food" />
                                                <option value="North Indian" />
                                                <option value="South Indian" />
                                                <option value="Chinese" />
                                                <option value="Beverages" />
                                                <option value="Sweets" />
                                            </datalist>
                                        </div>

                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={formData.isVeg} onChange={e => setFormData({ ...formData, isVeg: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-sm font-medium">Vegetarian</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-sm font-medium">Featured (Home Page)</span>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Image</label>
                                            <ImageUploader value={formData.image} onChange={v => setFormData({ ...formData, image: v })} onRemove={() => setFormData({ ...formData, image: "" })} />
                                        </div>

                                        <div className="flex gap-3 justify-end pt-4">
                                            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                            <Button type="submit">{editingItem ? "Update" : "Add"}</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "highlights" && <HighlightsManager />}
                {activeTab === "scans" && <ScansManager />}
                {activeTab === "gallery" && <GalleryManager />}
            </div>
        </div>
    );
}
