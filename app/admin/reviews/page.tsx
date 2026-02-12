"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Trash2, MessageSquare, Star, CheckCircle, Clock, Plus, X } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);

    // Manual Review Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newReview, setNewReview] = useState({
        userName: "",
        rating: 5,
        content: "",
        source: "Website" as "Website" | "Google",
    });

    const { showToast } = useToast();

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await storage.getAllReviews();
            setReviews(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load reviews", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await storage.addReview({
                ...newReview,
                images: [],
                tags: [],
                likes: 0,
                isApproved: true // Admin created reviews are auto-approved
            });
            showToast("Manual review added!", "success");
            setShowAddForm(false);
            setNewReview({ userName: "", rating: 5, content: "", source: "Website" });
            await loadReviews();
        } catch (error) {
            console.error(error);
            showToast("Failed to add review", "error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await storage.deleteReview(id);
            showToast("Review deleted successfully", "success");
            await loadReviews();
            setConfirmDelete(null); // Added to close dialog
        } catch (error) {
            console.error(error);
            showToast("Failed to delete review", "error");
        }
    };

    const handleToggleApprove = async (review: Review) => {
        try {
            await storage.approveReview(review.id, !review.isApproved);
            showToast(review.isApproved ? "Review hidden" : "Review approved", "success");
            await loadReviews();
        } catch (error) {
            console.error(error);
            showToast("Failed to update review status", "error");
        }
    };

    const handleReply = async (review: Review) => {
        if (!replyText.trim()) return;
        try {
            await storage.updateReview({ id: review.id, ownerResponse: replyText });
            showToast("Reply posted successfully", "success");
            setReplyingTo(null);
            setReplyText("");
            await loadReviews();
        } catch (error: any) {
            console.error("Failed to post reply:", error?.message || error);
            showToast(`Failed to post reply: ${error?.message || "Check console"}`, "error");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete(null)}
                confirmLabel="Delete"
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair flex items-center gap-2">
                        <Star className="h-8 w-8 text-yellow-400" />
                        Manage Reviews
                    </h1>
                    <p className="text-muted-foreground">Approve, delete, or reply to customer feedback.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                    {showAddForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Manual Review</>}
                </Button>
            </div>

            {showAddForm && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Add Manual Review (e.g. from Google)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddReview} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Customer Name</label>
                                    <Input
                                        required
                                        placeholder="Ex. Rahul Singh"
                                        value={newReview.userName}
                                        onChange={e => setNewReview({ ...newReview, userName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rating (1-5)</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={newReview.rating}
                                        onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    >
                                        {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Source</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={newReview.source}
                                        onChange={e => setNewReview({ ...newReview, source: e.target.value as any })}
                                    >
                                        <option value="Website">Website</option>
                                        <option value="Google">Google</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Review Content</label>
                                <Textarea
                                    required
                                    placeholder="Write the review text here..."
                                    value={newReview.content}
                                    onChange={e => setNewReview({ ...newReview, content: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Save and Publish Review</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-40 bg-gray-50 rounded-2xl animate-pulse border" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center text-gray-400">
                    <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No reviews found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <Card key={review.id} className={`overflow-hidden transition-all ${!review.isApproved ? "border-amber-200 bg-amber-50/10" : "bg-card shadow-sm hover:shadow-md"}`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-inner">
                                                    {review.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                        {review.userName}
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-tighter ${review.source === "Google"
                                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            }`}>
                                                            {review.source}
                                                        </span>
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {timeAgo(review.date)}
                                                        {!review.isApproved && (
                                                            <span className="text-amber-600 font-bold">• PENDING APPROVAL</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                                            "{review.content}"
                                        </p>

                                        {review.ownerResponse && (
                                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-tighter">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Your Response
                                                </div>
                                                <p className="text-sm text-emerald-800 font-medium">{review.ownerResponse}</p>
                                            </div>
                                        )}

                                        {replyingTo === review.id && (
                                            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300 bg-white p-4 rounded-xl border">
                                                <Textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write your response to this customer..."
                                                    className="min-h-[100px] bg-slate-50 border-none focus-visible:ring-1"
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                                    <Button size="sm" onClick={() => handleReply(review)}>Send Reply</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex md:flex-col gap-2 justify-end md:justify-start md:border-l pl-0 md:pl-6 min-w-[140px]">
                                        <Button
                                            variant={review.isApproved ? "outline" : "default"}
                                            size="sm"
                                            onClick={() => handleToggleApprove(review)}
                                            className={`w-full transition-all ${!review.isApproved ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100" : ""}`}
                                        >
                                            {review.isApproved ? "Hide" : "Approve"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setReplyingTo(review.id);
                                                setReplyText(review.ownerResponse || "");
                                            }}
                                            className="w-full gap-2 hover:bg-slate-50"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Reply
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmDelete({ id: review.id })}
                                            className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
