# 🍽️ Milan Restaurant - Digital Platform

> A premium, full-stack restaurant management and customer engagement platform built with **Next.js 14** and **Supabase**.

![Project Status](https://img.shields.io/badge/status-live-emerald?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase)

## 📖 Overview

The **Milan Restaurant Platform** is a dual-interface application designed to serve both customers and restaurant administration.
- **Customer Facing**: A beautiful, responsive website for browsing the menu, reading reviews, viewing the gallery, and contacting the restaurant.
- **Admin Dashboard**: A secure, comprehensive control panel for managing every aspect of the restaurant's digital presence and daily operations.

## ✨ Key Features

### 🏢 For Administrators
*   **Intuitive Dashboard**: Real-time overview of menu items, reviews, messages, and staff.
*   **Menu Management**: Add, edit, price, and categorize dishes dynamically.
*   **Review Control System**: Moderate customer reviews, reply to feedback, and manually add reviews from external sources (e.g., Google).
*   **Gallery & Media**: Upload and manage restaurant highlights and gallery images with like counters.
*   **Staff Management**: Maintain a digital registry of staff members with roles and contact details.
*   **Operational Tools**:
    *   **Stock Manager**: Track inventory levels.
    *   **Udhar Book**: Digital ledger for credit management.
*   **Secure Access**: Protected routes with session-based authentication.

### 🍕 For Customers
*   **Interactive Menu**: Browse dishes with categories, prices, and descriptions.
*   **Gallery Showcase**: View high-quality images of the ambiance and food.
*   **Reviews & Ratings**: Read verified reviews and submit feedback.
*   **Responsive Design**: Seamless experience across mobile, tablet, and desktop.
*   **Dark Mode**: Fully supported system-wide dark/light theme.

## 🛠️ Technology Stack

*   **Frontend**: Next.js 14 (App Router), React, TypeScript
*   **Styling**: Tailwind CSS, Shadcn UI (Components), Framer Motion (Animations)
*   **Backend / Database**: Supabase (PostgreSQL, Storage, Auth)
*   **Icons**: Lucide React

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js 18+ installed
*   Git installed
*   A Supabase project created

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/milan-restaurant.git
    cd milan-restaurant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
    ```

4.  **Database Setup**
    Run the SQL scripts provided in `supabase_schema.sql` in your Supabase SQL Editor to creating the necessary tables.

5.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.
    Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages
│   ├── admin/            # Protected admin routes (Dashboard, Reviews, etc.)
│   ├── (public)/         # Public customer facing pages
│   └── api/              # API routes
├── components/           # React components
│   ├── admin/            # Admin-specific components (Sidebar, Forms)
│   ├── ui/               # Reusable UI components (Buttons, Cards)
│   └── ...
├── lib/                  # Utilities
│   ├── storage.ts        # Supabase data access layer
│   └── types.ts          # TypeScript interfaces
└── public/               # Static assets
```

## 🚢 Deployment

The project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.) in Vercel project settings.
4.  Deploy!

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

---
*Built with ❤️ for Milan Restaurant.*
