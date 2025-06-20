"use client";

import { useState } from "react";
import { X, MessageCircle, Send, Star } from "lucide-react";

interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  reason: string;
  rating: number;
  comments: string;
  improvements: string;
}

const USAGE_REASONS = [
  { id: "curiosity", label: "Just curious about AI-generated UIs" },
  { id: "research", label: "Research/academic purposes" },
  { id: "testing", label: "Testing AI capabilities" },
  { id: "development", label: "Learning about AI development" },
  { id: "entertainment", label: "For fun/entertainment" },
  { id: "work", label: "Work-related project" },
  { id: "other", label: "Other" },
];

export function FeedbackModal({
  isVisible,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [improvements, setImprovements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      reason: selectedReason,
      rating,
      comments,
      improvements,
    };

    try {
      await onSubmit(feedbackData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setRating(0);
    setComments("");
    setImprovements("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Feedback
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
            autoComplete="off"
          >
            <p className="text-sm text-gray-600">
              We'd love to learn more about your experience! This helps us
              improve the system.
            </p>

            {/* Usage Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What brought you here today?
              </label>
              <div className="space-y-2">
                {USAGE_REASONS.map((reason) => (
                  <label key={reason.id} className="flex items-center">
                    <input
                      type="radio"
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {reason.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate your experience so far?
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {rating > 0 && `${rating} star${rating !== 1 ? "s" : ""}`}
                </span>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you think about the AI-generated interfaces?
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts about the non-deterministic OS concept..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows={3}
              />
            </div>

            {/* Improvements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would make this even better? (Optional)
              </label>
              <textarea
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Any suggestions for improvements or features you'd like to see..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows={2}
              />
            </div>
          </form>
        </div>

        {/* Fixed Actions Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
