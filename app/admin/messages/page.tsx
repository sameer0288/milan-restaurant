"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { CustomerMessage } from "@/lib/types";
import { AdminTable } from "@/components/admin/AdminTable";
import { useToast } from "@/components/ui/toast";
import { MessageSquare, Trash2, Calendar, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<CustomerMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await storage.getMessages();
            setMessages(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load messages", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this message?")) {
            try {
                await storage.deleteMessage(id);
                showToast("Message deleted successfully", "success");
                await loadMessages();
            } catch (error) {
                console.error(error);
                showToast("Failed to delete message", "error");
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair flex items-center gap-2">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        Customer Enquiries
                    </h1>
                    <p className="text-muted-foreground">Manage messages sent from your website's contact form.</p>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-24 bg-gray-50 rounded-xl" />
                        </Card>
                    ))}
                </div>
            ) : messages.length === 0 ? (
                <div className="bg-card border border-dashed border-gray-300 rounded-2xl py-20 text-center text-gray-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No messages received yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-lg font-bold">
                                        <User className="h-4 w-4 text-primary" />
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {item.phone}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap italic border border-muted">
                                    "{item.message}"
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
