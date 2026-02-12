"use client";

import { Review } from "@/lib/types";
import { Star, ThumbsUp, Quote, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
        >
            {/* Background Decorative Element */}
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                                {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                                {review.source === "Google" ? (
                                    <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                                        <ExternalLink className="h-2 w-2 text-white" />
                                    </div>
                                ) : (
                                    <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Globe className="h-2 w-2 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{review.userName}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                <span>{timeAgo(review.date)}</span>
                                <span className="h-1 w-1 bg-gray-300 rounded-full" />
                                <span className={review.source === "Google" ? "text-blue-500" : "text-emerald-500"}>
                                    Via {review.source || "Website"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100">
                        <span className="font-black text-amber-700 text-sm">{review.rating}</span>
                        <Star className="h-3 w-3 fill-amber-700 text-amber-700" />
                    </div>
                </div>

                <div className="relative mb-6">
                    <Quote className="absolute -top-4 -left-2 h-8 w-8 text-primary/5 -z-10" />
                    <p className="text-gray-700 text-sm leading-relaxed italic line-clamp-4 relative">
                        {review.content}
                    </p>
                </div>

                {review.images && review.images.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                        {review.images.map((img, idx) => (
                            <div key={idx} className="relative h-20 w-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform duration-300">
                                <Image
                                    src={img}
                                    alt={`Review image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {(review.tags || []).map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100/50 font-bold uppercase tracking-tight">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-4">
                    <button className="flex items-center gap-2 hover:text-primary transition-colors font-medium">
                        <div className="h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50">
                            <ThumbsUp className="h-3.5 w-3.5 group-hover:fill-primary group-hover:text-primary" />
                        </div>
                        <span>Helpful ({review.likes})</span>
                    </button>
                    {review.source === "Google" && (
                        <a href="#" className="flex items-center gap-1 text-blue-500 hover:underline font-bold">
                            View original <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>

                {review.ownerResponse && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 relative"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Response from Milan
                        </div>
                        <p className="text-sm text-emerald-900 font-medium leading-relaxed italic">
                            "{review.ownerResponse}"
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
