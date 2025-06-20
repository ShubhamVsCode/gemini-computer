"use client";

import { useState } from "react";
import { X, AlertTriangle, TestTube, Settings } from "lucide-react";

interface RateLimitBannerProps {
  isVisible: boolean;
  onClose: () => void;
  onTest?: () => void;
  onChangeModel?: () => void;
}

export function RateLimitBanner({
  isVisible,
  onClose,
  onTest,
  onChangeModel,
}: RateLimitBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Rate Limited by Google Gemini
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    We're currently experiencing rate limiting from Google
                    Gemini API. Try switching to a different model or test the
                    system to see if the issue persists.
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {onChangeModel && (
                      <button
                        onClick={onChangeModel}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                      >
                        <Settings className="w-3 h-3" />
                        Change Model
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="h-1 bg-orange-100 rounded-b-lg overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
