"use client";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio",
  description: "Manage portfolio content, connections, reviews, and feedback.",
};

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <AdminDashboard />
    </div>
  );
}
