"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyBottomBar } from "@/components/StickyBottomBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { storage } from "@/lib/storage";
import { GalleryImage, Review } from "@/lib/types";
import { Clock, Users, Leaf, Star, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReviewsSection } from "@/components/ReviewsSection";

export default function AboutPage() {
    const [gallery, setGallery] = useState<GalleryImage[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [g, r] = await Promise.all([
                storage.getGallery(),
                storage.getReviews()
            ]);
            setGallery(g);
            setReviews(r);
        } catch (error) {
            console.error("Failed to load about data:", error);
        }
    };

    const services = [
        {
            icon: Clock,
            title: "Happy Hour Food",
            description: "Special discounts during happy hours",
        },
        {
            icon: Users,
            title: "Private Dining Room",
            description: "Perfect for family gatherings and celebrations",
        },
        {
            icon: Leaf,
            title: "Vegetarian Options",
            description: "Wide variety of pure veg dishes",
        },
        {
            icon: Award,
            title: "Quality Food",
            description: "Fresh ingredients and authentic recipes",
        },
        {
            icon: Heart,
            title: "Family Friendly",
            description: "Comfortable seating for families",
        },
        {
            icon: Star,
            title: "Highly Rated",
            description: "4.3 stars from 729 happy customers",
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen">
                {/* Header */}
                <section className="bg-gradient-to-br from-red-700 to-red-900 text-white py-16">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                            <p className="text-xl text-red-100">
                                Your favorite family restaurant in Makrana
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Welcome to Milan Restaurant
                                </h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Located at Bay Pass Teeraha on Manglana Road in Makrana, Milan
                                        Restaurant has been serving the community with delicious food
                                        and warm hospitality. We are proud to be a family restaurant
                                        that caters to all tastes and preferences.
                                    </p>
                                    <p>
                                        Our menu features an extensive variety of cuisines including
                                        North Indian, South Indian, Chinese, and Fast Food. Whether
                                        you're craving traditional flavors or looking for something
                                        quick and tasty, we have something for everyone.
                                    </p>
                                    <p>
                                        With a rating of 4.3 stars from over 729 satisfied customers,
                                        we take pride in our commitment to quality, taste, and service.
                                        Our team works tirelessly to ensure every dish is prepared with
                                        fresh ingredients and authentic recipes.
                                    </p>
                                    <p>
                                        We offer comfortable seating for families, private dining rooms
                                        for special occasions, and a welcoming atmosphere that makes
                                        every visit memorable. Come experience the Milan difference!
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Services
                            </h2>
                            <p className="text-gray-600 text-lg">
                                What makes us special
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                                            <Icon className="h-7 w-7 text-red-700" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600">{service.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                {gallery.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Gallery
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    A glimpse of our restaurant
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {gallery.map((image, index) => (
                                    <motion.div
                                        key={image.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Reviews / Testimonials Section */}
                <section className="py-16 bg-white border-t">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
                            <p className="text-muted-foreground">Real feedback from our satisfied guests</p>
                        </div>
                        <ReviewsSection initialReviews={reviews} />
                    </div>
                </section>

                {/* Contact Info */}
                <section className="py-16 bg-gradient-to-br from-red-700 to-red-900 text-white">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Visit Us Today
                            </h2>
                            <p className="text-xl text-red-100 mb-6">
                                Bay Pass Teeraha, Manglana Rd, Makrana, Rajasthan 341505
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="tel:+917023232376"
                                    className="bg-white text-red-700 px-8 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                                >
                                    Call: +91 70232 32376
                                </a>
                                <a
                                    href="https://wa.me/917023232376"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                >
                                    WhatsApp Us
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
            <StickyBottomBar />
            <WhatsAppButton />
        </>
    );
}
