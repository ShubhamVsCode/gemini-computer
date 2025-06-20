"use client";

import { useState } from "react";
import {
  Bug,
  X,
  Eye,
  EyeOff,
  MessageSquare,
  Zap,
  RotateCcw,
} from "lucide-react";

interface DebugPanelProps {
  // Banner controls
  showRateLimitBanner: boolean;
  onToggleRateLimitBanner: () => void;

  // Feedback modal controls
  showFeedbackModal: boolean;
  onToggleFeedbackModal: () => void;

  // Usage limit modal controls
  showUsageLimitModal: boolean;
  onToggleUsageLimitModal: () => void;

  // Model selector controls
  modelSelectorOpen: boolean;
  onToggleModelSelector: () => void;

  // Streaming state controls
  isStreaming: boolean;
  onToggleStreaming: () => void;

  // Interaction count controls
  interactionCount: number;
  onSetInteractionCount: (count: number) => void;

  // Usage limit controls
  usageCount: number;
  onSetUsageCount: (count: number) => void;
  isUpgraded: boolean;
  onToggleUpgraded: () => void;

  // Reset feedback shown state
  onResetFeedbackShown: () => void;
}

export function DebugPanel({
  showRateLimitBanner,
  onToggleRateLimitBanner,
  showFeedbackModal,
  onToggleFeedbackModal,
  showUsageLimitModal,
  onToggleUsageLimitModal,
  modelSelectorOpen,
  onToggleModelSelector,
  isStreaming,
  onToggleStreaming,
  interactionCount,
  onSetInteractionCount,
  usageCount,
  onSetUsageCount,
  isUpgraded,
  onToggleUpgraded,
  onResetFeedbackShown,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Only show debug panel in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-[9999] bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Open Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl">
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4" />
          <span className="text-sm font-medium">Debug Panel</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-red-700 rounded transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-red-700 rounded transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 space-y-4 w-72">
          {/* Rate Limit Banner */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Rate Limit Banner
            </h3>
            <button
              onClick={onToggleRateLimitBanner}
              className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                showRateLimitBanner
                  ? "bg-orange-100 text-orange-800 border border-orange-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              {showRateLimitBanner ? "Hide Banner" : "Show Banner"}
            </button>
          </div>

          {/* Feedback Modal */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Feedback Modal
            </h3>
            <div className="space-y-2">
              <button
                onClick={onToggleFeedbackModal}
                className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                  showFeedbackModal
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                <MessageSquare className="w-3 h-3 inline mr-1" />
                {showFeedbackModal ? "Hide Modal" : "Show Modal"}
              </button>
              <button
                onClick={onResetFeedbackShown}
                className="w-full px-3 py-2 text-sm bg-yellow-100 text-yellow-800 border border-yellow-300 rounded transition-colors hover:bg-yellow-200"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                Reset Feedback State
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Model Selector
            </h3>
            <button
              onClick={onToggleModelSelector}
              className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                modelSelectorOpen
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              {modelSelectorOpen ? "Close Selector" : "Open Selector"}
            </button>
          </div>

          {/* Streaming State */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Streaming State
            </h3>
            <button
              onClick={onToggleStreaming}
              className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                isStreaming
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              <Zap className="w-3 h-3 inline mr-1" />
              {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </button>
          </div>

          {/* Interaction Count */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Interaction Count
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Current: {interactionCount}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => onSetInteractionCount(count)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    interactionCount === count
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Usage Limit Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Usage Limits
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Usage: {usageCount}/{isUpgraded ? "20" : "10"}
                </span>
                <button
                  onClick={onToggleUsageLimitModal}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    showUsageLimitModal
                      ? "bg-orange-100 text-orange-800 border border-orange-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {showUsageLimitModal ? "Hide" : "Show"} Modal
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[0, 5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => onSetUsageCount(count)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      usageCount === count
                        ? "bg-orange-100 text-orange-800 border border-orange-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <button
                onClick={onToggleUpgraded}
                className={`w-full px-2 py-1 text-xs rounded transition-colors ${
                  isUpgraded
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {isUpgraded ? "Upgraded" : "Free Tier"}
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>ENV: {process.env.NODE_ENV}</div>
              <div>Debug Panel Active</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
