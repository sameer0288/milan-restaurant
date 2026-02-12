"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { ContactInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Trash2, Plus } from "lucide-react";

export default function AdminSettingsPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        whatsapp: "",
        phone: "",
        address: "",
        mapsLink: "",
    });
    const [logo, setLogo] = useState<string>("");

    // New Dynamic Backgrounds
    const [heroImages, setHeroImages] = useState<{ id: string, image_url: string }[]>([]);
    const [makranaImages, setMakranaImages] = useState<{ id: string, image_url: string }[]>([]);

    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setContactInfo(await storage.getContact());
            setLogo(await storage.getLogo());
            setHeroImages(await storage.getHeroImages());
            setMakranaImages(await storage.getMakranaImages());
        } catch (error) {
            console.error("Failed to load settings", error);
        }
    };

    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await storage.setContact(contactInfo);
            showToast("Contact intelligence updated", "success");
        } catch (error) {
            showToast("Failed to save contact data", "error");
        }
    };

    // Hero Images Logic
    const handleAddHeroImage = async (url: string) => {
        try {
            await storage.addHeroImage(url);
            setHeroImages(await storage.getHeroImages());
            showToast("Background added", "success");
        } catch (error) {
            showToast("Failed to add image", "error");
        }
    };

    const handleDeleteHero = async (id: string) => {
        if (!confirm("Remove this background?")) return;
        try {
            await storage.deleteHeroImage(id);
            setHeroImages(await storage.getHeroImages());
            showToast("Background removed", "success");
        } catch (error) {
            showToast("Failed to remove image", "error");
        }
    };

    // Makrana Images Logic
    const handleAddMakranaImage = async (url: string) => {
        try {
            await storage.addMakranaImage(url);
            setMakranaImages(await storage.getMakranaImages());
            showToast("Image added", "success");
        } catch (error) {
            showToast("Failed to add image", "error");
        }
    };

    const handleDeleteMakrana = async (id: string) => {
        if (!confirm("Remove this image?")) return;
        try {
            await storage.deleteMakranaImage(id);
            setMakranaImages(await storage.getMakranaImages());
            showToast("Image removed", "success");
        } catch (error) {
            showToast("Failed to remove image", "error");
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <div>
                <h1 className="text-3xl font-bold font-playfair mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage website content, images, and contact info.</p>
            </div>

            {/* General Settings */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-4xl">
                <form onSubmit={handleSaveContact} className="space-y-8">

                    {/* Logo Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Restaurant Logo</h2>
                        <div className="max-w-xs">
                            <ImageUploader
                                value={logo}
                                onChange={async (newUrl) => {
                                    setLogo(newUrl);
                                    if (newUrl) {
                                        try {
                                            await storage.setLogo(newUrl);
                                            showToast("Logo updated instantly across system", "success");
                                        } catch (err) {
                                            showToast("Logo storage failed", "error");
                                        }
                                    }
                                }}
                                onRemove={async () => {
                                    setLogo("");
                                    await storage.setLogo("");
                                }}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Upload a transparent PNG. Updates everywhere instantly.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-6">
                        <h2 className="text-xl font-semibold">Contact Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">WhatsApp Number</label>
                                <Input value={contactInfo.whatsapp} onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                <Input value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2">Address</label>
                                <Input value={contactInfo.address} onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2">Google Maps Link</label>
                                <Input value={contactInfo.mapsLink} onChange={(e) => setContactInfo({ ...contactInfo, mapsLink: e.target.value })} required />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                        Update Contact Intelligence
                    </Button>
                </form>
            </div>

            {/* Hero Backgrounds Management */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Home Page Backgrounds</h2>
                    <p className="text-muted-foreground text-sm">Upload multiple images for the main hero section. They will cycle automatically every 10 seconds.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {heroImages.map((img) => (
                        <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden group">
                            <img src={img.image_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDeleteHero(img.id)} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Add New Button / Uploader Wrapper */}
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 relative">
                        <div className="absolute inset-0 opacity-0 z-10 cursor-pointer">
                            {/* Trick to use ImageUploader just for upload without preview state here */}
                            <div className="h-full w-full">
                                <ImageUploader onChange={handleAddHeroImage} onRemove={() => { }} />
                            </div>
                        </div>
                        <div className="text-center pointer-events-none">
                            <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
                            <span className="text-xs font-semibold text-muted-foreground">Add Image</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* I Love Makrana Backgrounds Management */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">"I Love Makrana" Banner</h2>
                    <p className="text-muted-foreground text-sm">Upload background images for the Makrana banner. Cycles every 10 seconds.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {makranaImages.map((img) => (
                        <div key={img.id} className="relative aspect-[3/1] rounded-lg overflow-hidden group">
                            <img src={img.image_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDeleteMakrana(img.id)} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="aspect-[3/1] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 relative">
                        <div className="absolute inset-0 opacity-0 z-10 cursor-pointer">
                            <div className="h-full w-full">
                                <ImageUploader onChange={handleAddMakranaImage} onRemove={() => { }} />
                            </div>
                        </div>
                        <div className="text-center pointer-events-none">
                            <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground">Add Image</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
