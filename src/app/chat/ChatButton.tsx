import React from "react";
import { Button, Space, Typography } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CompassOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

interface ButtonData {
  id: string;
  text: string;
  type: "user" | "agent" | "environment" | "system";
}

interface ChatButtonProps {
  content: string;
  onButtonClick?: (buttonId: string, buttonText: string) => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ content, onButtonClick }) => {
  // Extract buttons from content
  const parseButtons = (text: string): ButtonData[] => {
    const buttonRegex = /\[([\d.]+)\]\((.*?)\)/g;
    const buttons: ButtonData[] = [];
    let match;

    while ((match = buttonRegex.exec(text)) !== null) {
      const id = match[1];
      const text = match[2];
      let type: ButtonData["type"] = "user";

      // Determine button type based on ID
      if (
        id.startsWith("001.1") ||
        id.startsWith("001.2") ||
        id.startsWith("001.3")
      ) {
        type = "user";
      } else if (
        id.startsWith("001.4") ||
        id.startsWith("001.5") ||
        id.startsWith("001.6")
      ) {
        type = "agent";
      } else if (
        id.startsWith("001.7") ||
        id.startsWith("001.8") ||
        id.startsWith("001.9")
      ) {
        type = "environment";
      } else if (id.startsWith("!sys")) {
        type = "system";
      }

      buttons.push({ id, text, type });
    }

    return buttons;
  };

  // Split content into message and buttons section
  const parts = content.split("---\n\n#### **Actionable Buttons**");
  const messageContent = parts[0];
  const buttonsSection = parts[1];

  // Format message content - handle settings blocks and line breaks
  const formattedMessage = messageContent
    .replace(/\[Setting:.*?\]/g, (match) => `🎬 ${match}`)
    .trim();

  // Parse buttons if they exist
  const buttons = buttonsSection ? parseButtons(buttonsSection) : [];

  // Group buttons by type
  const userButtons = buttons.filter((b) => b.type === "user");
  const agentButtons = buttons.filter((b) => b.type === "agent");
  const envButtons = buttons.filter((b) => b.type === "environment");
  const sysButtons = buttons.filter((b) => b.type === "system");

  const renderButtonGroup = (
    title: string,
    buttonList: ButtonData[],
    icon: React.ReactNode
  ) => {
    if (buttonList.length === 0) return null;

    return (
      <div style={{ marginBottom: 16 }}>
        <Text
          type="secondary"
          style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        >
          {icon} <span style={{ marginLeft: 8 }}>{title}</span>
        </Text>
        <Space wrap>
          {buttonList.map((button) => (
            <Button
              key={button.id}
              onClick={() => onButtonClick?.(button.id, button.text)}
              type={button.type === "system" ? "primary" : "default"}
              size="middle"
            >
              {button.text}
            </Button>
          ))}
        </Space>
      </div>
    );
  };

  return (
    <div>
      {/* Render message content */}
      <Paragraph style={{ whiteSpace: "pre-line", marginBottom: 16 }}>
        {formattedMessage}
      </Paragraph>

      {/* Render buttons if they exist */}
      {buttons.length > 0 && (
        <>
          {renderButtonGroup("User Actions", userButtons, <UserOutlined />)}
          {renderButtonGroup("Agent Actions", agentButtons, <RobotOutlined />)}
          {renderButtonGroup(
            "Environment Actions",
            envButtons,
            <CompassOutlined />
          )}
          {sysButtons.length > 0 && (
            <Space wrap>
              {sysButtons.map((button) => (
                <Button
                  key={button.id}
                  type="text"
                  size="small"
                  onClick={() => onButtonClick?.(button.id, button.text)}
                >
                  {button.text}
                </Button>
              ))}
            </Space>
          )}
        </>
      )}
    </div>
  );
};

export default ChatButton;
