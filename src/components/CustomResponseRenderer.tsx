import React, { FC, useEffect, useState } from "react";
import { Card, Space, Typography } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { ResponseRendererProps } from "@nlux/react";
import CustomChatButton from "./CustomChatButton";

const { Text } = Typography;

interface ExtendedResponseRendererProps extends ResponseRendererProps<string> {
  onAction?: (action: { type: string; payload: any }) => void;
}

const MyCustomRenderer: FC<ExtendedResponseRendererProps> = ({
  status,
  content,
  containerRef,
  onAction,
}) => {
  const [buttonsContent, setButtonsContent] = useState<string>("");

  useEffect(() => {
    if (content) {
      try {
        const textContent =
          typeof content === "string" ? content : content.join("");

        const buttonsMatch = textContent.match(/<buttons>([^]*?)<\/buttons>/);
        if (buttonsMatch) {
          setButtonsContent(buttonsMatch[0]);
        }
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
      <div ref={containerRef}></div>
      <CustomChatButton
        content={buttonsContent}
        onButtonClick={(id, label) => {
          onAction?.({
            type: "button_click",
            payload: { id, label },
          });
        }}
      />
    </Card>
  );
};

export default MyCustomRenderer;
