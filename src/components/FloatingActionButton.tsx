import React from "react";
import { Button } from "antd";
import {
  MessageOutlined,
  DeleteOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";

interface FloatingActionButtonProps {
  onScenarioClick: () => void;
  onClearChat: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onScenarioClick,
  onClearChat,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const buttonStyle = {
    borderRadius: "24px",
    width: "180px", // Fixed width for all buttons
    height: "40px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingLeft: "16px",
    paddingRight: "16px",
    justifyContent: "flex-start",
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "25px",
        bottom: "125px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "8px",
          transition: "all 0.3s ease",
        }}
      >
        {isExpanded && (
          <>
            <Button
              type="primary"
              style={buttonStyle}
              onClick={onScenarioClick}
            >
              <MessageOutlined /> Change Scenario
            </Button>
            <Button type="primary" style={buttonStyle} onClick={onClearChat}>
              <DeleteOutlined /> Clear Chat
            </Button>
          </>
        )}
      </div>
      <Button
        type="primary"
        style={{
          ...buttonStyle,
          transition: "all 0.2s ease",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <LeftCircleOutlined rotate={isExpanded ? 90 : -90} />
        {isExpanded ? "Close Menu" : "Chat Menu"}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
