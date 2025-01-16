import React, { FC, useCallback } from "react";
import { StreamResponseComponentProps, PromptRendererProps } from "@nlux/react";
import ChatButton from "./ChatButton";
import { useChatStore } from "@/store/chat-store";

interface ButtonClickHandlerProps {
  sessionId?: string;
  buttonId: string;
  buttonText: string;
}

// Custom renderer for AI responses
export const ResponseRenderer: FC<StreamResponseComponentProps<string>> = ({
  containerRef,
  status,
  content,
  sessionId,
}) => {
  const { addMessage } = useChatStore();

  const handleButtonClick = useCallback(
    ({ buttonId, buttonText, sessionId }: ButtonClickHandlerProps) => {
      if (!sessionId) {
        console.error("No sessionId provided for button click");
        return;
      }

      // Handle different button types based on ID prefix
      const buttonTypeMap: { [key: string]: string } = {
        "001.1": "user",
        "001.2": "user",
        "001.3": "user",
        "001.4": "agent",
        "001.5": "agent",
        "001.6": "agent",
        "001.7": "environment",
        "001.8": "environment",
        "001.9": "environment",
        "!sys": "system",
      };

      // Determine the button type
      const buttonType =
        Object.entries(buttonTypeMap).find(([prefix]) =>
          buttonId.startsWith(prefix)
        )?.[1] || "user";

      // Create message object
      const message = {
        id: crypto.randomUUID(),
        role: buttonType,
        content: buttonText,
        createdAt: new Date(),
        metadata: {
          buttonId,
          buttonType,
        },
      };

      // Add message to chat store
      addMessage(sessionId, message);

      // Additional handling based on button type
      if (buttonType === "system") {
        // Handle system commands
        console.log("System command triggered:", buttonText);
      }
    },
    [addMessage]
  );

  // Safely get content string
  const messageContent = Array.isArray(content)
    ? content[0]
    : typeof content === "string"
    ? content
    : "";

  // Check if content is still streaming
  const isStreaming = status === "streaming";

  // Helper to check if content has buttons
  const hasButtons = messageContent.includes("**Actionable Buttons**");

  return (
    <div className="ai-response relative">
      {/* Container for streamed markdown content */}
      <div
        ref={containerRef}
        className={isStreaming ? "streaming-content" : "completed-content"}
      />

      {/* Show buttons only when streaming is complete and content exists */}
      {status === "complete" && hasButtons && (
        <div className="buttons-container mt-4">
          <ChatButton
            content={messageContent}
            onButtonClick={(buttonId, buttonText) =>
              handleButtonClick({ sessionId, buttonId, buttonText })
            }
          />
        </div>
      )}

      {/* Loading indicator while streaming */}
      {isStreaming && (
        <div className="streaming-indicator">
          <span className="loading-dots">...</span>
        </div>
      )}
    </div>
  );
};

// Custom renderer for user prompts
export const PromptRenderer: FC<PromptRendererProps> = ({
  content,
  isEditing,
  onEditComplete,
}) => {
  // Handle prompt editing
  const handleEdit = useCallback(
    (editedContent: string) => {
      if (onEditComplete) {
        onEditComplete(editedContent);
      }
    },
    [onEditComplete]
  );

  return (
    <div className="user-prompt relative p-4 rounded-lg bg-gray-50">
      {isEditing ? (
        <textarea
          defaultValue={content}
          onBlur={(e) => handleEdit(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className="prose max-w-none">{content}</div>
      )}
    </div>
  );
};

// Type definitions for message store
interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
  metadata?: {
    buttonId?: string;
    buttonType?: string;
  };
}

// Export types for use in other components
export type { ChatMessage, ButtonClickHandlerProps };
