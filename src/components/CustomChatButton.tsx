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
  categories: Category[];
  onButtonClick: (buttonId: string, buttonText: string) => void;
}

const CustomChatButton: FC<CustomChatButtonProps> = ({
  categories,
  onButtonClick,
}) => {
  const otherCategories = categories.filter(
    (category) => category.name !== "System"
  );

  const renderButtonGroup = (
    title: string,
    buttonList: Button[],
    icon: React.ReactNode
  ) => {
    if (!buttonList.length) return null;

    return (
      <div key={title} style={{ marginBottom: 16 }}>
        <Text
          type="secondary"
          style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        >
          {icon} <span style={{ marginLeft: 8 }}>{title}</span>
        </Text>
        <Space wrap>
          {buttonList.map((button) => (
            <AntButton
              key={button.id}
              onClick={() => onButtonClick(button.id, button.label)}
              type="default"
              size="middle"
            >
              {button.label}
            </AntButton>
          ))}
        </Space>
      </div>
    );
  };

  const getIcon = (categoryName: string) => {
    switch (categoryName) {
      case "User Actions":
        return <UserOutlined />;
      case "Agent Actions":
        return <RobotOutlined />;
      case "Environment Actions":
        return <CompassOutlined />;
      case "System":
        return null; // System buttons are handled elsewhere, so don't return an icon
      default:
        console.warn(
          `Unknown category "${categoryName}", using SettingOutlined icon.`
        );
        return <SettingOutlined />;
    }
  };

  return (
    <div>
      {otherCategories.map((category) =>
        renderButtonGroup(
          category.name,
          category.buttons,
          getIcon(category.name)
        )
      )}
    </div>
  );
};

export default CustomChatButton;
