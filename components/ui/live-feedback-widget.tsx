
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Users, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/use-rate-limit";

interface FeedbackItem {
  id: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
}

export function LiveFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { checkRateLimit, isLimited } = useRateLimit({
    maxRequests: 5,
    windowMs: 300000,
    action: "feedback_widget",
  });

  useEffect(() => {
    fetchFeedbackCount();
    const channel = supabase
      .channel("feedback_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feedback",
        },
        (payload) => {
          console.log("Feedback change:", payload);
          fetchFeedbackCount();
          if (payload.eventType === "INSERT") {
            fetchRecentFeedback();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFeedbackCount = async () => {
    try {
      const { count, error } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true })
        .eq("type", "feedback");

      if (error) throw error;
      setFeedbackCount(count || 0);
    } catch (error) {
      console.error("Error fetching feedback count:", error);
    }
  };

  const fetchRecentFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("id, content, created_at")
        .eq("type", "feedback")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentFeedback(
        data.map((item) => ({
          ...item,
          is_anonymous: true,
        }))
      );
    } catch (error) {
      console.error("Error fetching recent feedback:", error);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) return;

    if (!checkRateLimit()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert([
        {
          content: feedback,
          type: "feedback",
          status: "open",
          priority: "normal",
        },
      ]);

      if (error) throw error;

      setFeedback("");
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback. It helps improve the site!",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          {feedbackCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {feedbackCount > 99 ? "99+" : feedbackCount}
            </Badge>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="shadow-2xl border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Quick Feedback
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{feedbackCount} people have shared feedback</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Rate limited: 5 submissions per 5 minutes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Share your thoughts about this portfolio..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{feedback.length}/500</span>
                      <Button
                        onClick={submitFeedback}
                        disabled={!feedback.trim() || isSubmitting || isLimited}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </div>

                  {recentFeedback.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent feedback:</h4>
                      {recentFeedback.map((item) => (
                        <div key={item.id} className="p-2 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
