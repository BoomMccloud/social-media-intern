import React, { FC, useEffect, useState } from "react";
import { Card, Space, Typography } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { ResponseRendererProps } from "@nlux/react";
import ChatButton from "./ChatButton";

const { Text } = Typography;

interface ExtendedResponseRendererProps extends ResponseRendererProps<string> {
  onAction?: (action: { type: string; payload: any }) => void;
}

const CustomResponseRenderer: FC<ExtendedResponseRendererProps> = ({
  status,
  content,
  containerRef,
  onAction,
}) => {
  const [processedContent, setProcessedContent] = useState<string>("");

  useEffect(() => {
    if (content && content[0]) {
      console.log("Received content:", content[0]);
      try {
        setProcessedContent(content[0]);
      } catch (error) {
        console.error("Error processing content:", error);
      }
    }
  }, [content]);

  return (
    <Card
      size="small"
      className="w-full mb-4"
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
      <div ref={containerRef}>
        <ChatButton
          content={processedContent}
          onButtonClick={(id, label) => {
            onAction?.({
              type: "button_click",
              payload: { id, label },
            });
          }}
        />
      </div>
    </Card>
  );
};

export default CustomResponseRenderer;
