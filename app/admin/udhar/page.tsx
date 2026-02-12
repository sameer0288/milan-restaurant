"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { UdharRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { ReceiptIndianRupee, Plus, CheckCircle, Search, Trash2, Calendar, Phone, AlertCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";


export default function UdharPage() {
    const [records, setRecords] = useState<UdharRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        customerName: "",
        phone: "",
        amount: "",
        description: "",
    });
    const { showToast } = useToast();

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            const data = await storage.getUdharRecords();
            setRecords(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load records", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.customerName || !newItem.amount) return;

        try {
            await storage.addUdhar({
                customerName: newItem.customerName,
                phone: newItem.phone,
                amount: parseFloat(newItem.amount),
                description: newItem.description,
            });
            showToast("Record added successfully", "success");
            setNewItem({ customerName: "", phone: "", amount: "", description: "" });
            setShowForm(false);
            loadRecords();
        } catch (error) {
            console.error(error);
            showToast("Failed to add record", "error");
        }
    };

    const handleMarkPaid = async (id: string, currentStatus: boolean) => {
        try {
            await storage.updateUdharStatus(id, !currentStatus);
            showToast(currentStatus ? "Marked as Unpaid" : "Marked as Paid", "success");
            loadRecords();
        } catch (error) {
            console.error(error);
            showToast("Failed to update status", "error");
        }
    };

    const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await storage.deleteUdhar(id);
            showToast("Record deleted", "success");
            loadRecords();
            setConfirmDelete(null);
        } catch (error) {
            console.error(error);
            showToast("Failed to delete", "error");
        }
    };

    const filteredRecords = records.filter(r =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm)
    );

    const totalUdhar = records.filter(r => !r.isPaid).reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Settle/Discard Record"
                message="Are you sure you want to permanently remove this financial record from the ledger? This action cannot be reversed."
                onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete(null)}
                confirmLabel="Finalize Removal"
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair flex items-center gap-2">
                        <ReceiptIndianRupee className="h-8 w-8 text-primary" />
                        Udhar Book
                    </h1>
                    <p className="text-muted-foreground">Manage customer credits and debts.</p>
                </div>

                <Card className="bg-red-50 border-red-100 min-w-[200px]">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-red-600 font-medium text-sm">Total Outstanding</span>
                        <span className="text-2xl font-bold text-red-700">₹{totalUdhar.toLocaleString()}</span>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or phone..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="w-full md:w-auto">
                    {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> New Record</>}
                </Button>
            </div>

            {/* Add Form */}
            {showForm && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Udhar Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Customer Name</label>
                                <Input required placeholder="Ex. Rahul" value={newItem.customerName} onChange={e => setNewItem({ ...newItem, customerName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input placeholder="Ex. 9876543210" value={newItem.phone} onChange={e => setNewItem({ ...newItem, phone: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Amount (₹)</label>
                                <Input required type="number" placeholder="Ex. 500" value={newItem.amount} onChange={e => setNewItem({ ...newItem, amount: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input placeholder="Ex. Tea & Snacks" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                            </div>
                            <div className="md:col-span-4 lg:col-span-4 flex justify-end">
                                <Button type="submit" className="w-full md:w-auto">Save Record</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Records List - Card Style for better mobile view, but Table for desktop */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading records...</td></tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{record.customerName}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {record.phone || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{record.amount}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{record.description || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.isPaid
                                                ? "bg-green-100 text-green-800 border border-green-200"
                                                : "bg-red-100 text-red-800 border border-red-200"
                                                }`}>
                                                {record.isPaid ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant={record.isPaid ? "outline" : "default"}
                                                className={`h-8 ${record.isPaid ? "text-gray-500" : "bg-green-600 hover:bg-green-700"}`}
                                                onClick={() => handleMarkPaid(record.id, record.isPaid)}
                                            >
                                                {record.isPaid ? "Undo" : <><CheckCircle className="h-3 w-3 mr-1" /> Mark Paid</>}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => setConfirmDelete({ id: record.id })}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
