"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { StockItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Package, Plus, Search, Trash2, AlertCircle, RefreshCw, PenSquare } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";


export default function StockPage() {
    const [items, setItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<StockItem | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        unit: "kg",
        minThreshold: "",
    });
    const { showToast } = useToast();

    useEffect(() => {
        loadStock();
    }, []);

    const loadStock = async () => {
        try {
            const data = await storage.getStockItems();
            setItems(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load inventory", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await storage.updateStockQuantity(editingItem.id, parseFloat(newItem.quantity));
                showToast("Stock updated", "success");
            } else {
                await storage.addStockItem({
                    name: newItem.name,
                    quantity: parseFloat(newItem.quantity),
                    unit: newItem.unit,
                    minThreshold: parseFloat(newItem.minThreshold) || 5,
                });
                showToast("New item added", "success");
            }
            resetForm();
            loadStock();
        } catch (error) {
            console.error(error);
            showToast("Failed to save item", "error");
        }
    };

    const resetForm = () => {
        setNewItem({ name: "", quantity: "", unit: "kg", minThreshold: "" });
        setEditingItem(null);
        setShowForm(false);
    };

    const handleEdit = (item: StockItem) => {
        setEditingItem(item);
        setNewItem({
            name: item.name,
            quantity: item.quantity.toString(),
            unit: item.unit,
            minThreshold: item.minThreshold.toString(),
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await storage.deleteStockItem(id);
            showToast("Item removed", "success");
            loadStock();
            setConfirmDelete(null);
        } catch (error) {
            console.error(error);
            showToast("Failed to delete", "error");
        }
    };

    const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Low Stock Alert
    const lowStockItems = items.filter(i => i.quantity <= i.minThreshold);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Discard Supply Asset"
                message="Are you sure you want to permanently remove this item from the active inventory? This action is irreversible."
                onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete(null)}
                confirmLabel="Secure Removal"
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair flex items-center gap-2">
                        <Package className="h-8 w-8 text-primary" />
                        Stock Manager
                    </h1>
                    <p className="text-muted-foreground">Monitor inventory levels and restocking needs.</p>
                </div>

                {lowStockItems.length > 0 && (
                    <Card className="bg-orange-50 border-orange-200 animate-pulse w-full md:w-auto">
                        <CardContent className="p-4 flex items-center gap-3 text-orange-800">
                            <AlertCircle className="h-6 w-6 text-orange-600" />
                            <div>
                                <span className="block font-bold text-lg">{lowStockItems.length} Items Low Stock</span>
                                <span className="text-xs text-orange-600">Consider restocking soon.</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search ingredients..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
                    {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add Item</>}
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <Card className="border-primary/20 bg-blue-50/30">
                    <CardHeader>
                        <CardTitle>{editingItem ? "Update Stock" : "Add New Inventory Item"}</CardTitle>
                        <CardDescription>
                            {editingItem ? `Updating quantity for ${editingItem.name}` : "Enter details for new stock item"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="lg:col-span-2 space-y-2">
                                <label className="text-sm font-medium">Item Name</label>
                                <Input required disabled={!!editingItem} placeholder="Ex. Basmati Rice" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantity</label>
                                <Input required type="number" step="0.01" placeholder="0.00" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit</label>
                                <select
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newItem.unit}
                                    onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                    disabled={!!editingItem}
                                >
                                    <option value="kg">kg (Kilograms)</option>
                                    <option value="l">L (Liters)</option>
                                    <option value="pcs">pcs (Pieces)</option>
                                    <option value="g">g (Grams)</option>
                                    <option value="pkts">pkts (Packets)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-red-600">Low Alert At</label>
                                <Input required type="number" disabled={!!editingItem} placeholder="5" value={newItem.minThreshold} onChange={e => setNewItem({ ...newItem, minThreshold: e.target.value })} />
                            </div>
                            <div className="lg:col-span-1 flex justify-end">
                                <Button type="submit" className="w-full">Save</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Low Limit</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading inventory...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No items found.</td></tr>
                            ) : (
                                filteredItems.map((item) => {
                                    const isLow = item.quantity <= item.minThreshold;
                                    return (
                                        <tr key={item.id} className={`transition-colors ${isLow ? "bg-red-50/50" : "hover:bg-gray-50"}`}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800 text-lg">{item.quantity}</td>
                                            <td className="px-6 py-4 text-gray-500 uppercase">{item.unit}</td>
                                            <td className="px-6 py-4 text-gray-400">{item.minThreshold}</td>
                                            <td className="px-6 py-4">
                                                {isLow ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Healthy
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                                    <PenSquare className="h-3 w-3 mr-1" /> Update
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ id: item.id })}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
