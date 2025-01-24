import React, { FC } from "react";
import { Button, Space, Typography } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CompassOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface ButtonData {
  id: string;
  label: string;
  type: "user" | "agent" | "environment" | "system";
}

interface ChatButtonProps {
  content: string;
  onButtonClick?: (buttonId: string, buttonText: string) => void;
}

const ChatButton: FC<ChatButtonProps> = ({
  content,
  onButtonClick,
}): JSX.Element => {
  const parseButtons = (text: string): ButtonData[] => {
    console.log("Parsing text:", text);
    const parsedButtons: ButtonData[] = [];

    // Extract everything between <buttons> tags
    const buttonMatch = text.match(/<buttons>([\s\S]*?)<\/buttons>/);
    if (!buttonMatch) {
      console.log("No buttons section found");
      return parsedButtons;
    }

    const buttonContent = buttonMatch[1];
    console.log("Button content:", buttonContent);

    // Split into category sections
    const categoryBlocks = buttonContent.split(/<category>/g).filter(Boolean);
    console.log("Category blocks:", categoryBlocks);

    categoryBlocks.forEach((block) => {
      // Get category name
      const categoryMatch = block.match(/^([^<]+)/);
      if (!categoryMatch) return;

      const categoryName = categoryMatch[1].trim().toLowerCase();
      console.log("Processing category:", categoryName);

      // Parse buttons in this category
      const buttonMatches = block.matchAll(
        /<button id="([^"]+)" label="([^"]+)"/g
      );

      for (const match of Array.from(buttonMatches)) {
        const [_, id, label] = match;
        const type: ButtonData["type"] =
          categoryName === "system"
            ? "system"
            : categoryName === "agent actions"
            ? "agent"
            : categoryName === "environment actions"
            ? "environment"
            : "user";

        parsedButtons.push({ id, label, type });
      }
    });

    console.log("Final parsed buttons:", parsedButtons);
    return parsedButtons;
  };

  // Split content and parse buttons with debug logging
  const parts = content.split(/<buttons>/);
  console.log("Split parts:", parts);
  const messageContent = parts[0];
  const buttonsContent = parts[1] ? `<buttons>${parts[1]}` : "";
  console.log("Message content:", messageContent);
  console.log("Buttons content:", buttonsContent);

  const allButtons = buttonsContent ? parseButtons(buttonsContent) : [];
  console.log("Parsed buttons:", allButtons);
  const userButtons = allButtons.filter((b) => b.type === "user");
  const agentButtons = allButtons.filter((b) => b.type === "agent");
  const envButtons = allButtons.filter((b) => b.type === "environment");
  const sysButtons = allButtons.filter((b) => b.type === "system");

  const renderButtonGroup = (
    title: string,
    buttonList: ButtonData[],
    icon: React.ReactNode
  ): JSX.Element | null => {
    if (buttonList.length === 0) return null;

    return (
      <div className="mb-4">
        <Text type="secondary" className="flex items-center mb-2">
          {icon} <span className="ml-2">{title}</span>
        </Text>
        <Space wrap>
          {buttonList.map((button) => (
            <Button
              key={button.id}
              onClick={() => onButtonClick?.(button.id, button.label)}
              type={button.type === "system" ? "text" : "default"}
              size={button.type === "system" ? "small" : "middle"}
            >
              {button.label}
            </Button>
          ))}
        </Space>
      </div>
    );
  };

  return (
    <div>
      <div className="whitespace-pre-line mb-4">{messageContent.trim()}</div>

      {allButtons.length > 0 && (
        <div className="mt-4">
          {renderButtonGroup("User Actions", userButtons, <UserOutlined />)}
          {renderButtonGroup("Agent Actions", agentButtons, <RobotOutlined />)}
          {renderButtonGroup(
            "Environment Actions",
            envButtons,
            <CompassOutlined />
          )}
          {renderButtonGroup("System", sysButtons, <SettingOutlined />)}
        </div>
      )}
    </div>
  );
};

export default ChatButton;
