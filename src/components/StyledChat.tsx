import { AiChat } from "@nlux/react";

const StyledChatPanel = ({ ...props }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-full w-full">
      <AiChat
        {...props}
        displayOptions={{
          ...props.displayOptions,
          containerClassName: "bg-gray-100 dark:bg-gray-800"
        }}
      />
    </div>
  );
};

export default StyledChatPanel;