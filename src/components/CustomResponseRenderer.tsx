import React, { FC, useState, useRef, useLayoutEffect, useEffect } from "react";
import { Card, Space, Typography, Button as AntButton } from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  MutedOutlined,
} from "@ant-design/icons";
import type { ResponseRendererProps } from "@nlux/react";

const { Text } = Typography;

interface Button {
  id: string;
  label: string;
}

interface ExtendedResponseRendererProps extends ResponseRendererProps<string> {
  onAction?: (action: { type: string; payload: any }) => void;
}

const MyCustomRenderer: FC<ExtendedResponseRendererProps> = ({
  status,
  content,
  containerRef,
  onAction,
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const systemButtons: Button[] = [
    { id: "sys.0", label: "Increase Verbosity" },
    { id: "sys.1", label: "Decrease Verbosity" },
  ];

  useLayoutEffect(() => {
    if (
      (innerRef.current && typeof content === "string") ||
      (Array.isArray(content) && content.length > 0)
    ) {
      const textContent =
        typeof content === "string" ? content : content.join("");
      innerRef.current.innerHTML = textContent;
    }
  }, [content]);

  const renderSystemButtons = () => {
    return (
      <div className="system-buttons-container">
        <div className="system-buttons">
          <Text
            type="secondary"
            style={{ marginRight: 8, display: "flex", alignItems: "center" }}
          >
            <MutedOutlined style={{ marginRight: 5 }} />
            Adjust Response Length:
          </Text>
          <Space size={"small"}>
            {systemButtons.map((button) => {
              let icon;
              if (button.label === "Increase Verbosity") {
                icon = <PlusOutlined />;
              }
              if (button.label === "Decrease Verbosity") {
                icon = <MinusOutlined />;
              }
              if (!icon) {
                return null;
              }
              return (
                <AntButton
                  key={button.id}
                  onClick={() =>
                    onAction?.({
                      type: "button_click",
                      payload: { id: button.id, label: button.label },
                    })
                  }
                  type="default"
                  icon={icon}
                  size="small"
                />
              );
            })}
          </Space>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Card
        size="small"
        className="w-full mb-4 transparent-card"
        title={
          <Space>
            {status === "streaming" ? (
              <>
                <LoadingOutlined className="text-blue-500" />
                <Text type="secondary">Generating response...</Text>
              </>
            ) : (
              <>
                <CheckCircleOutlined className="text-green-500" />
                <Text type="secondary">Response complete</Text>
              </>
            )}
          </Space>
        }
      >
        <div className="response-container">
          <div ref={innerRef} className="whitespace-pre-wrap" />
        </div>
      </Card>
      {renderSystemButtons()}
    </div>
  );
};

export default MyCustomRenderer;
