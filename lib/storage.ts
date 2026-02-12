import { createClient } from "@supabase/supabase-js";
import { compressImage } from "./imageUtils";
import { MenuItem, MenuHighlight, MenuScan, Review, ContactInfo, CustomerMessage, AdminSession, StaffMember, UdharRecord, StockItem, GalleryImage } from "./types";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const storage = {
    // --- Helper for Storage Deletion ---
    deleteImageFromStorage: async (url: string | null) => {
        if (!url || !url.includes("supabase.co/storage/v1/object/public/images/")) return;
        try {
            const fileName = url.split("/").pop();
            if (fileName) {
                await supabase.storage.from("images").remove([fileName]);
            }
        } catch (error) {
            console.error("Failed to delete image from storage:", error);
        }
    },

    // --- Generic Image Upload ---
    uploadImage: async (file: File): Promise<string | null> => {
        try {
            const compressedFile = await compressImage(file);
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;

            const { data, error } = await supabase.storage
                .from("images")
                .upload(fileName, compressedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error("Supabase Storage Error:", error);
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
            return publicUrl;
        } catch (error) {
            console.error("Upload failed", error);
            return null;
        }
    },

    // --- Menu Items ---
    getMenu: async (): Promise<MenuItem[]> => {
        try {
            const { data, error } = await supabase.from("menu_items").select("*").order("created_at", { ascending: false });
            if (error) {
                console.error("Supabase Menu Error:", JSON.stringify(error, null, 2));
                return [];
            }
            return (data || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                category: item.category,
                isVeg: item.is_veg,
                image: item.image_url,
                isFeatured: item.is_featured
            }));
        } catch (err) {
            console.error("Unexpected Menu Error:", err);
            return [];
        }
    },


    addDish: async (item: Omit<MenuItem, "id">): Promise<void> => {
        const { error } = await supabase.from("menu_items").insert([{
            name: item.name,
            price: item.price,
            category: item.category,
            is_veg: item.isVeg,
            image_url: item.image,
            is_featured: item.isFeatured
        }]);
        if (error) throw error;
    },
    updateDish: async (id: string, updates: Partial<MenuItem>): Promise<void> => {
        // Map updates to DB columns
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.isVeg !== undefined) dbUpdates.is_veg = updates.isVeg;
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;

        if (updates.image !== undefined) {
            // Fetch old image to delete it
            const { data } = await supabase.from("menu_items").select("image_url").eq("id", id).single();
            if (data?.image_url && data.image_url !== updates.image) {
                await storage.deleteImageFromStorage(data.image_url);
            }
            dbUpdates.image_url = updates.image;
        }

        const { error } = await supabase.from("menu_items").update(dbUpdates).eq("id", id);
        if (error) throw error;
    },
    deleteDish: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("menu_items").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("menu_items").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Menu Highlights ---
    getHighlights: async (): Promise<MenuHighlight[]> => {
        const { data, error } = await supabase.from("menu_highlights").select("*").order("created_at", { ascending: true });
        if (error) return [];
        return (data || []).map((h: any) => ({
            id: h.id,
            name: h.name,
            image: h.image_url,
            price: h.price
        }));
    },
    addHighlight: async (highlight: Omit<MenuHighlight, "id">): Promise<void> => {
        const { error } = await supabase.from("menu_highlights").insert([{
            name: highlight.name,
            image_url: highlight.image,
            price: highlight.price
        }]);
        if (error) throw error;
    },
    updateHighlight: async (id: string, updates: Partial<MenuHighlight>): Promise<void> => {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.price) dbUpdates.price = updates.price;

        if (updates.image) {
            const { data } = await supabase.from("menu_highlights").select("image_url").eq("id", id).single();
            if (data?.image_url && data.image_url !== updates.image) {
                await storage.deleteImageFromStorage(data.image_url);
            }
            dbUpdates.image_url = updates.image;
        }

        const { error } = await supabase.from("menu_highlights").update(dbUpdates).eq("id", id);
        if (error) throw error;
    },
    deleteHighlight: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("menu_highlights").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("menu_highlights").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Menu Scans ---
    getScans: async (): Promise<MenuScan[]> => {
        const { data, error } = await supabase.from("menu_scans").select("*").order("display_order", { ascending: true });
        if (error) return [];
        return (data || []).map((s: any) => ({
            id: s.id,
            title: s.title,
            image: s.image_url,
            order: s.display_order
        }));
    },
    addScan: async (scan: Omit<MenuScan, "id">): Promise<void> => {
        const { error } = await supabase.from("menu_scans").insert([{
            title: scan.title,
            image_url: scan.image,
            display_order: scan.order
        }]);
        if (error) throw error;
    },
    updateScan: async (id: string, updates: Partial<MenuScan>): Promise<void> => {
        const dbUpdates: any = {};
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.order) dbUpdates.display_order = updates.order;

        if (updates.image) {
            const { data } = await supabase.from("menu_scans").select("image_url").eq("id", id).single();
            if (data?.image_url && data.image_url !== updates.image) {
                await storage.deleteImageFromStorage(data.image_url);
            }
            dbUpdates.image_url = updates.image;
        }

        const { error } = await supabase.from("menu_scans").update(dbUpdates).eq("id", id);
        if (error) throw error;
    },
    updateScanOrder: async (id: string, order: number): Promise<void> => {
        const { error } = await supabase.from("menu_scans").update({ display_order: order }).eq("id", id);
        if (error) throw error;
    },
    deleteScan: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("menu_scans").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("menu_scans").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Reviews ---
    getReviews: async (): Promise<Review[]> => {
        try {
            const { data, error } = await supabase.from("reviews").select("*").eq("is_approved", true).order("created_at", { ascending: false });
            if (error) {
                console.error("Supabase Reviews Error:", JSON.stringify(error, null, 2));
                return [];
            }
            return (data || []).map((r: any) => ({
                id: r.id,
                userName: r.customer_name,
                rating: r.rating,
                date: r.created_at,
                content: r.comment,
                images: r.image_url ? [r.image_url] : [],
                tags: [],
                likes: 0,
                source: r.source || "Website",
                isApproved: r.is_approved,
                ownerResponse: r.owner_response
            }));
        } catch (err) {
            console.error("Unexpected Reviews Error:", err);
            return [];
        }
    },
    getAllReviews: async (): Promise<Review[]> => { // Admin view
        const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
        if (error) return [];
        return (data || []).map((r: any) => ({
            id: r.id,
            userName: r.customer_name,
            rating: r.rating,
            date: r.created_at,
            content: r.comment,
            images: r.image_url ? [r.image_url] : [],
            tags: [],
            likes: 0,
            source: r.source || "Website",
            isApproved: r.is_approved,
            ownerResponse: r.owner_response
        }));
    },
    addReview: async (review: Omit<Review, "id" | "date" | "is_approved">): Promise<void> => {
        const { error } = await supabase.from("reviews").insert([{
            customer_name: review.userName,
            rating: review.rating,
            comment: review.content,
            image_url: review.images?.[0] || null,
            source: review.source || "Website",
            is_approved: review.isApproved ?? false
        }]); // Pending by default unless specified
        if (error) throw error;
    },
    approveReview: async (id: string, approved: boolean): Promise<void> => {
        const { error } = await supabase.from("reviews").update({ is_approved: approved }).eq("id", id);
        if (error) throw error;
    },
    deleteReview: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("reviews").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("reviews").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Messages ---
    addMessage: async (msg: Omit<CustomerMessage, "id" | "date">): Promise<void> => {
        const { error } = await supabase.from("messages").insert([{
            name: msg.name,
            phone: msg.phone,
            message: msg.message
        }]);
        if (error) throw error;
    },
    getMessages: async (): Promise<CustomerMessage[]> => {
        try {
            const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
            if (error) {
                console.error("Supabase Messages Error:", JSON.stringify(error, null, 2));
                return [];
            }
            return (data || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                phone: m.phone,
                message: m.message,
                date: m.created_at
            }));
        } catch (err) {
            console.error("Unexpected Messages Error:", err);
            return [];
        }
    },
    deleteMessage: async (id: string): Promise<void> => {
        const { error } = await supabase.from("messages").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Reviews ---
    updateReview: async (review: Partial<Review> & { id: string }): Promise<void> => {
        const updates: any = {};
        if (review.userName) updates.customer_name = review.userName;
        if (review.rating) updates.rating = review.rating;
        if (review.content) updates.comment = review.content;
        if (review.ownerResponse !== undefined) updates.owner_response = review.ownerResponse; // Correct column name depends on schema
        if (review.isApproved !== undefined) updates.is_approved = review.isApproved;

        const { error } = await supabase.from("reviews").update(updates).eq("id", review.id);
        if (error) throw error;
    },

    // --- Settings (Contact, Logo) ---
    getContact: async (): Promise<ContactInfo> => {
        const { data } = await supabase.from("settings").select("value").eq("key", "contact_info").single();
        return data?.value || { whatsapp: "", phone: "", address: "", mapsLink: "" };
    },
    setContact: async (info: ContactInfo): Promise<void> => {
        const { error } = await supabase.from("settings").upsert({ key: "contact_info", value: info });
        if (error) throw error;
    },
    getLogo: async (): Promise<string> => {
        const { data } = await supabase.from("settings").select("value").eq("key", "logo_url").single();
        return data?.value?.url || "";
    },
    setLogo: async (url: string): Promise<void> => {
        // Fetch current logo to delete it
        const { data: current } = await supabase.from("settings").select("value").eq("key", "logo_url").single();
        if (current?.value?.url) {
            await storage.deleteImageFromStorage(current.value.url);
        }

        const { error } = await supabase.from("settings").upsert({ key: "logo_url", value: { url } });
        if (error) throw error;
        // Dispatch event for local UI updates in Navbar
        if (typeof window !== "undefined") window.dispatchEvent(new Event("logo-update"));
    },

    // --- Hero Images (Matches schema: id, image_url) ---
    getHeroImages: async (): Promise<{ id: string, image_url: string }[]> => {
        const { data, error } = await supabase.from("hero_images").select("*").order("display_order", { ascending: true });
        if (error) return [];
        return data || [];
    },
    addHeroImage: async (url: string): Promise<void> => {
        const { error } = await supabase.from("hero_images").insert([{ image_url: url }]);
        if (error) throw error;
    },
    deleteHeroImage: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("hero_images").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("hero_images").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Makrana Images (Matches schema: id, image_url) ---
    getMakranaImages: async (): Promise<{ id: string, image_url: string }[]> => {
        const { data, error } = await supabase.from("makrana_images").select("*").order("display_order", { ascending: true });
        if (error) return [];
        return data || [];
    },
    addMakranaImage: async (url: string): Promise<void> => {
        const { error } = await supabase.from("makrana_images").insert([{ image_url: url }]);
        if (error) throw error;
    },
    deleteMakranaImage: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("makrana_images").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("makrana_images").delete().eq("id", id);
        if (error) throw error;
    },

    getGallery: async (): Promise<GalleryImage[]> => {
        try {
            const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
            if (error) {
                console.error("Supabase Gallery Fetch Error:", error.message);
                return [];
            }
            return (data || []).map((img: any) => ({
                id: img.id,
                url: img.image_url,
                alt: img.alt_text || "",
                likes: img.likes || 0,
                showcaseOrder: img.showcase_order
            }));
        } catch (err) {
            console.error("Unexpected Gallery Error:", err);
            return [];
        }
    },
    getShowcaseImages: async (): Promise<GalleryImage[]> => {
        try {
            const { data, error } = await supabase.from("gallery")
                .select("*")
                .not("showcase_order", "is", null)
                .order("showcase_order", { ascending: true })
                .limit(5);

            if (error) return [];

            return (data || []).map((img: any) => ({
                id: img.id,
                url: img.image_url,
                alt: img.alt_text || "",
                likes: img.likes || 0,
                showcaseOrder: img.showcase_order
            }));
        } catch (err) {
            return [];
        }
    },
    updateGalleryOrder: async (id: string, order: number | null): Promise<void> => {
        const { error } = await supabase.from("gallery").update({ showcase_order: order }).eq("id", id);
        if (error) {
            console.error("Gallery Order Update Error:", error);
            // Check for missing column error
            if (error.message.includes("column \"showcase_order\" of relation \"gallery\" does not exist")) {
                console.warn("Please run: ALTER TABLE gallery ADD COLUMN showcase_order INTEGER;");
            }
            throw error;
        }
    },
    addGalleryImage: async (url: string, alt?: string): Promise<void> => {
        const { error } = await supabase.from("gallery").insert([{
            image_url: url,
            alt_text: alt || ""
        }]);
        if (error) {
            console.error("Gallery Save Error:", error.message, error.details);
            throw error;
        }
    },
    deleteGalleryImage: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("gallery").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("gallery").delete().eq("id", id);
        if (error) throw error;
    },
    likeGalleryImage: async (id: string): Promise<void> => {
        try {
            if (!id) throw new Error("Missing image ID for like operation");

            // First fetch current record
            const { data, error: selectError } = await supabase
                .from("gallery")
                .select("likes")
                .eq("id", id);

            if (selectError) {
                if (selectError.code === "PGRST204" || selectError.message.includes("column gallery.likes does not exist")) {
                    console.group("%c ACTION REQUIRED: Missing Database Column ", "background: #ef4444; color: white; padding: 4px; border-radius: 4px; font-weight: bold;");
                    console.error("The 'likes' column is missing from your 'gallery' table.");
                    console.warn("FIX: Run the following SQL in your Supabase Dashboard SQL Editor:");
                    console.info("%c ALTER TABLE gallery ADD COLUMN likes INTEGER DEFAULT 0; ", "background: #1e293b; color: #10b981; padding: 10px; display: block; margin: 10px 0; border-radius: 8px; font-family: monospace;");
                    console.groupEnd();
                    return; // Fail gracefully
                }
                console.group("Gallery Like [Select Phase] Diagnostic");
                console.error("Message:", selectError.message);
                console.error("Details:", selectError.details);
                console.groupEnd();
                throw selectError;
            }

            if (!data || data.length === 0) {
                console.warn("Gallery Like: Image not found in DB for ID:", id);
                return;
            }

            const currentLikes = data[0]?.likes || 0;
            const { error: updateError } = await supabase
                .from("gallery")
                .update({ likes: currentLikes + 1 })
                .eq("id", id);

            if (updateError) {
                console.group("Gallery Like [Update Phase] Diagnostic");
                console.error("Message:", updateError.message);
                console.groupEnd();
                throw updateError;
            }
        } catch (err: any) {
            console.error("Final Gallery Like Exception:", err?.message || err);
            throw err;
        }
    },

    // --- Staff Management ---
    getStaff: async (): Promise<StaffMember[]> => {
        const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Supabase Staff Error:", JSON.stringify(error, null, 2));
            return [];
        }
        return (data || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            phone: s.phone,
            email: s.email,
            aadhar: s.aadhar,
            dateOfJoining: s.date_of_joining,
            image: s.image_url
        }));
    },
    addStaff: async (staff: Omit<StaffMember, "id">): Promise<void> => {
        const { error } = await supabase.from("staff").insert([{
            name: staff.name,
            role: staff.role,
            phone: staff.phone,
            email: staff.email,
            aadhar: staff.aadhar,
            date_of_joining: staff.dateOfJoining,
            image_url: staff.image
        }]);
        if (error) throw error;
    },
    deleteStaff: async (id: string): Promise<void> => {
        // Fetch image URL first
        const { data } = await supabase.from("staff").select("image_url").eq("id", id).single();
        if (data?.image_url) {
            await storage.deleteImageFromStorage(data.image_url);
        }
        const { error } = await supabase.from("staff").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Udhar Management ---
    getUdharRecords: async (): Promise<UdharRecord[]> => {
        const { data, error } = await supabase.from("udhar_records").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Supabase Udhar Error:", JSON.stringify(error, null, 2));
            return [];
        }
        return (data || []).map((u: any) => ({
            id: u.id,
            customerName: u.customer_name,
            phone: u.phone,
            amount: Number(u.amount),
            description: u.description,
            isPaid: u.is_paid,
            createdAt: u.created_at
        }));
    },
    addUdhar: async (record: Omit<UdharRecord, "id" | "createdAt" | "isPaid">): Promise<void> => {
        const { error } = await supabase.from("udhar_records").insert([{
            customer_name: record.customerName,
            phone: record.phone,
            amount: record.amount,
            description: record.description,
            is_paid: false
        }]);
        if (error) throw error;
    },
    updateUdharStatus: async (id: string, isPaid: boolean): Promise<void> => {
        const { error } = await supabase.from("udhar_records").update({ is_paid: isPaid }).eq("id", id);
        if (error) throw error;
    },
    deleteUdhar: async (id: string): Promise<void> => {
        const { error } = await supabase.from("udhar_records").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Stock Management ---
    getStockItems: async (): Promise<StockItem[]> => {
        const { data, error } = await supabase.from("stock_items").select("*").order("name", { ascending: true });
        if (error) {
            console.error("Supabase Stock Error:", JSON.stringify(error, null, 2));
            return [];
        }
        return (data || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            quantity: Number(s.quantity),
            unit: s.unit,
            minThreshold: Number(s.min_threshold),
            lastUpdated: s.updated_at
        }));
    },
    addStockItem: async (item: Omit<StockItem, "id" | "lastUpdated">): Promise<void> => {
        const { error } = await supabase.from("stock_items").insert([{
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            min_threshold: item.minThreshold
        }]);
        if (error) throw error;
    },
    updateStockQuantity: async (id: string, quantity: number): Promise<void> => {
        const { error } = await supabase.from("stock_items").update({
            quantity: quantity,
            updated_at: new Date().toISOString()
        }).eq("id", id);
        if (error) throw error;
    },
    deleteStockItem: async (id: string): Promise<void> => {
        const { error } = await supabase.from("stock_items").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Admin ---
    verifyAdmin: async (password: string): Promise<boolean> => {
        return password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "milan123");
    },

    // Debug helper
    logError: (msg: string, err: any) => {
        if (err instanceof Error) {
            console.error(msg, {
                ...err,
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        } else {
            console.error(msg, JSON.stringify(err, null, 2));
        }
    }
};
