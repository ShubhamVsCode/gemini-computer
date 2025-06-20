"use client";

import { useState } from "react";
import { ChevronDown, Cpu, Zap, FlaskConical } from "lucide-react";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isDefault?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "gemini-2.5-flash-lite-preview-06-17",
    name: "Gemini 2.5 Flash-Lite Preview",
    description: "Latest experimental model with cutting-edge features",
    icon: <FlaskConical className="w-4 h-4" />,
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description: "Ultra-fast responses with enhanced creativity",
    icon: <Zap className="w-4 h-4" />,
    isDefault: true,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Reliable and stable performance",
    icon: <Cpu className="w-4 h-4" />,
  },
];

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModelData =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="text-white/80">{selectedModelData.icon}</div>
        <span className="hidden sm:inline text-white/90">
          {selectedModelData.name.replace(/Gemini\s*/i, "")}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-white/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg z-20">
            <div className="py-1">
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                    model.id === selectedModel
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${
                        model.id === selectedModel
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      {model.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium text-sm ${
                            model.id === selectedModel
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {model.name}
                        </span>
                        {model.isDefault && (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              model.id === selectedModel
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs ${
                          model.id === selectedModel
                            ? "text-blue-700"
                            : "text-gray-500"
                        }`}
                      >
                        {model.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
