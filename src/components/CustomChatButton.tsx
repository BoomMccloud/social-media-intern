import React, { FC } from "react";
import { Button as AntButton, Space, Typography } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CompassOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface Button {
  id: string;
  label: string;
}

interface Category {
  name: string;
  buttons: Button[];
}

interface CustomChatButtonProps {
  content: string;
  onButtonClick?: (buttonId: string, buttonText: string) => void;
}

const parseButtons = (message: string): Category[] => {
  const buttonsMatch = message.match(/<buttons>([^]*?)<\/buttons>/);

  if (!buttonsMatch) return [];

  const buttonsContent = buttonsMatch[1];
  const categoryRegex = /<category>([^]*?)<\/category>([^]*?)(?=<category>|$)/g;
  const categories: Category[] = [];
  let categoryMatch;

  while ((categoryMatch = categoryRegex.exec(buttonsContent)) !== null) {
    const categoryName = categoryMatch[1];
    const buttonsString = categoryMatch[2];
    const buttonRegex = /<button id="([^"]+)" label="([^"]+)"\s*\/>/g;
    const buttons: Button[] = [];
    let buttonMatch;

    while ((buttonMatch = buttonRegex.exec(buttonsString)) !== null) {
      buttons.push({
        id: buttonMatch[1],
        label: buttonMatch[2],
      });
    }

    categories.push({
      name: categoryName,
      buttons,
    });
  }
  return categories;
};

const CustomChatButton: FC<CustomChatButtonProps> = ({
  content,
  onButtonClick,
}) => {
  const handleButtonClick = (buttonId: string) => {
    console.log(`Button clicked: ${buttonId}`);
  };

  const renderButtonGroup = (
    title: string,
    buttonList: Button[],
    icon: React.ReactNode,
    type?: "system"
  ) => {
    if (buttonList.length === 0) return null;

    const mapButtons = (buttonList: Button[]) => {
      return buttonList.map((button) => (
        <AntButton
          key={button.id}
          onClick={() => onButtonClick?.(button.id, button.label)}
          type="default"
          size={type === "system" ? "small" : "middle"}
        >
          {button.label}
        </AntButton>
      ));
    };

    return (
      <div style={{ marginBottom: 16 }}>
        <Text
          type="secondary"
          style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        >
          {icon} <span style={{ marginLeft: 8 }}>{title}</span>
        </Text>
        <Space wrap>{mapButtons(buttonList)}</Space>
      </div>
    );
  };

  const categories = parseButtons(content);

  return (
    <>
      {categories.map((category, catIndex) => {
        if (category.name === "User Actions") {
          return renderButtonGroup(
            category.name,
            category.buttons,
            <UserOutlined />
          );
        } else if (category.name === "Agent Actions") {
          return renderButtonGroup(
            category.name,
            category.buttons,
            <RobotOutlined />
          );
        } else if (category.name === "Environment Actions") {
          return renderButtonGroup(
            category.name,
            category.buttons,
            <CompassOutlined />
          );
        } else {
          return renderButtonGroup(
            category.name,
            category.buttons,
            <SettingOutlined />,
            "system"
          );
        }
      })}
    </>
  );
};

export default CustomChatButton;
