export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: MenuCategory;
    isVeg: boolean;
    image: string;
    isFeatured: boolean;
}

export type MenuCategory = string;

export interface GalleryImage {
    id: string;
    url: string;
    alt: string;
    likes: number;
    showcaseOrder?: number;
}

export interface ContactInfo {
    whatsapp: string;
    phone: string;
    address: string;
    mapsLink: string;
}

export interface CustomerMessage {
    id: string;
    name: string;
    phone: string;
    message: string;
    date: string;
}

export interface Review {
    id: string;
    userName: string;
    rating: number; // 1-5
    date: string; // ISO string
    content: string;
    images: string[]; // base64 strings
    tags: string[]; // e.g., "vegetarian", "dosa"
    ownerResponse?: string;
    likes: number;
    source?: "Google" | "Website";
    isApproved?: boolean;
}

export interface AdminSession {
    isAuthenticated: boolean;
    timestamp: number;
}

export interface MenuHighlight {
    id: string;
    name: string;
    image: string; // base64
    price?: string;
}

export interface MenuScan {
    id: string;
    image: string; // base64
    title: string; // e.g., "Family Restaurant", "Fast Food"
    order?: number;
}

export interface StaffMember {
    id: string;
    name: string;
    role: string; // e.g. Chef, Waiter, Manager
    phone: string;
    email?: string;
    aadhar: string;
    dateOfJoining: string;
    image?: string;
}

export interface UdharRecord {
    id: string;
    customerName: string;
    phone: string;
    amount: number;
    description: string;
    isPaid: boolean;
    createdAt: string;
}

export interface StockItem {
    id: string;
    name: string;
    quantity: number;
    unit: string; // kg, L, pcs
    minThreshold: number;
    lastUpdated: string;
}
