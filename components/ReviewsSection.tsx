"use client";

import { useState, useMemo } from "react";
import { Review } from "@/lib/types";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Check, SlidersHorizontal, Star, MessageCircle, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
    initialReviews: Review[];
}

const FILTER_TAGS = [
    "All",
    "Vegetarian",
    "Dosa",
    "Service",
    "Sweets",
    "Pav Bhaji",
    "Behavior",
    "South Indian Food",
    "Malai Kofta",
    "White Sauce Pasta",
    "Sambhar",
    "Price",
    "Meal"
];

const SORT_OPTIONS = [
    { label: "Most Relevant", value: "relevant" },
    { label: "Newest", value: "newest" },
    { label: "Highest Rating", value: "highest" },
    { label: "Lowest Rating", value: "lowest" },
];

export function ReviewsSection({ initialReviews }: ReviewsSectionProps) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [activeSource, setActiveSource] = useState<"All" | "Google" | "Website">("All");
    const [sortBy, setSortBy] = useState("relevant");

    const tagCounts = useMemo(() => {
        const counts: Record<string, number> = { "All": initialReviews.length };
        initialReviews.forEach(review => {
            (review.tags || []).forEach(tag => {
                const normalizedTag = FILTER_TAGS.find(t => t.toLowerCase() === tag.toLowerCase());
                if (normalizedTag) {
                    counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
                }
            });
        });
        return counts;
    }, [initialReviews]);

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...initialReviews];

        // Filter by Source
        if (activeSource !== "All") {
            result = result.filter(r => r.source === activeSource);
        }

        // Filter by Tag
        if (activeFilter !== "All") {
            result = result.filter((review) =>
                (review.tags || []).some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase())) ||
                review.content.toLowerCase().includes(activeFilter.toLowerCase())
            );
        }

        // Sort
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            case "highest":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "lowest":
                result.sort((a, b) => a.rating - b.rating);
                break;
            case "relevant":
            default:
                result.sort((a, b) => {
                    const scoreA = (a.content.length / 10) + (a.likes * 5) + (a.images.length * 10);
                    const scoreB = (b.content.length / 10) + (b.likes * 5) + (b.images.length * 10);
                    return scoreB - scoreA;
                });
                break;
        }

        return result;
    }, [initialReviews, activeFilter, activeSource, sortBy]);

    const ratingStats = useMemo(() => {
        const total = initialReviews.length;
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const average = total > 0
            ? (initialReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
            : "0.0";

        initialReviews.forEach(r => {
            const rating = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
            if (distribution[rating] !== undefined) distribution[rating]++;
        });

        return { total, distribution, average };
    }, [initialReviews]);

    return (
        <div className="space-y-12">
            {/* Rating Summary - High End Modern UI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                        <Trophy className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-7xl font-black">{ratingStats.average}</span>
                            <span className="text-2xl text-red-200">/ 5.0</span>
                        </div>
                        <div className="flex gap-1 mb-6 text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={cn("h-6 w-6", i <= Math.round(Number(ratingStats.average)) ? "fill-current" : "opacity-30")} />
                            ))}
                        </div>
                        <p className="text-red-100 font-medium mb-8">Based on {ratingStats.total} authentic guest experiences</p>
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-red-800 bg-red-600 flex items-center justify-center text-xs font-bold shadow-lg">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="h-10 w-10 rounded-full border-2 border-red-800 bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                                +{Math.max(0, ratingStats.total - 4)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distribution Card */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-center">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = ratingStats.distribution[stars as 1 | 2 | 3 | 4 | 5];
                                const percentage = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center gap-4 group">
                                        <div className="flex items-center gap-1 min-w-[30px]">
                                            <span className="text-sm font-black text-gray-700">{stars}</span>
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 min-w-[40px] text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                    <MessageCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-gray-900">98% Positive</div>
                                    <div className="text-xs text-gray-400">Feedback from our beloved guests</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-gray-900">{ratingStats.total}+ Stories</div>
                                    <div className="text-xs text-gray-400">Shared by people like you</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls - Premium Filtering UI */}
            <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-white/40 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900">Filter Stories</h3>
                    </div>

                    {/* Source Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200/50">
                        {(["All", "Google", "Website"] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveSource(s)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                    activeSource === s ? "bg-white text-primary shadow-lg" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {FILTER_TAGS.map((tag) => {
                        const count = tagCounts[tag] || 0;
                        if (tag !== "All" && count === 0) return null;

                        return (
                            <button
                                key={tag}
                                onClick={() => setActiveFilter(tag)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                    activeFilter === tag
                                        ? "bg-primary text-white border-primary shadow-lg"
                                        : "bg-white text-gray-400 border-gray-100 hover:border-primary/20 hover:text-gray-600 shadow-sm"
                                )}
                            >
                                {tag}
                                {activeFilter === tag && <Check className="inline-block ml-2 h-3 w-3" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {filteredAndSortedReviews.length === 0 && (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="h-20 w-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <MessageCircle className="h-10 w-10" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-2">No stories found</p>
                    <p className="text-gray-400 text-sm mb-8">Try adjusting your filters to see more guest experiences.</p>
                    <Button variant="outline" className="rounded-2xl" onClick={() => { setActiveFilter("All"); setActiveSource("All"); }}>Reset All Filters</Button>
                </div>
            )}
        </div>
    );
}
