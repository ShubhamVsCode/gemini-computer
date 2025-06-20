"use client";

import { useState } from "react";
import { X, Mail, Zap, Check } from "lucide-react";

interface UsageLimitModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  currentUsage: number;
  isUpgraded: boolean;
}

export function UsageLimitModal({
  isVisible,
  onClose,
  onSubmit,
  currentUsage,
  isUpgraded,
}: UsageLimitModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  if (!isVisible) return null;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(emailValue));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!isValidEmail) return;

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsValidEmail(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isUpgraded ? "Generation Limit Reached" : "Upgrade to Continue"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>

            {!isUpgraded ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You've used all {currentUsage} free generations!
                </h3>
                <p className="text-gray-600 mb-4">
                  Enter your email to unlock 10 more generations and continue
                  exploring AI-generated interfaces.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You've reached the maximum limit
                </h3>
                <p className="text-gray-600 mb-4">
                  You've used all 20 generations. Thank you for exploring our
                  AI-generated interfaces!
                </p>
              </>
            )}
          </div>

          {!isUpgraded && (
            <>
              {/* Benefits */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  What you'll get:
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    10 additional generations (20 total)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    Continue exploring unique AI interfaces
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    No ads or interruptions
                  </li>
                </ul>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="your@email.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        email && !isValidEmail
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                  </div>
                  {email && !isValidEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  We'll only use your email to track usage. No spam, ever.
                </p>
              </form>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {isUpgraded ? "Close" : "Maybe Later"}
          </button>

          {!isUpgraded && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValidEmail || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Unlock 10 More Generations
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
