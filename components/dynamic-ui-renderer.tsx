"use client";

import { useRef, useEffect } from "react";

interface GeminiComputerRendererProps {
  html: string;
  onInteraction: (interactionId: string) => void;
}

export function GeminiComputerRenderer({
  html,
  onInteraction,
}: GeminiComputerRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html.trim()) return;

    // Set the content HTML directly into the container
    try {
      containerRef.current.innerHTML = html;
    } catch (error) {
      console.error("Error setting content HTML:", error);
      return;
    }

    // Add click event listeners to elements with data-interaction-id
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const clickedElement = target.closest(
        "[data-interaction-id]"
      ) as HTMLElement;

      if (clickedElement) {
        event.preventDefault();
        const interactionId = clickedElement.getAttribute(
          "data-interaction-id"
        );
        if (interactionId) {
          onInteraction(interactionId);
        }
      }
    };

    // Add event listener to container
    containerRef.current.addEventListener("click", handleClick);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("click", handleClick);
      }
    };
  }, [html, onInteraction]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col overflow-hidden"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
      }}
    />
  );
}
