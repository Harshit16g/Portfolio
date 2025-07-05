import { FeedbackTable } from "@/components/admin/feedback-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Management | Admin",
  description: "Manage user feedback and support requests.",
};

export default function AdminFeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Feedback Management</h1>
      <FeedbackTable />
    </div>
  );
}
