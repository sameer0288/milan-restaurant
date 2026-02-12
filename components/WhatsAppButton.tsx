"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppButton() {
    const handleClick = () => {
        window.open(
            "https://wa.me/917023232376?text=Hello Milan Restaurant, I want to enquire about food/order.",
            "_blank"
        );
    };

    return (
        <motion.button
            onClick={handleClick}
            className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
                boxShadow: [
                    "0 0 0 0 rgba(22, 163, 74, 0.7)",
                    "0 0 0 20px rgba(22, 163, 74, 0)",
                ],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
            }}
        >
            <MessageCircle className="h-6 w-6" />
        </motion.button>
    );
}
