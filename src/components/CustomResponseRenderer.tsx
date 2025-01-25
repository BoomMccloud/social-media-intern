// MyCustomRenderer.tsx
import React, { FC, useRef, useEffect, useState } from "react";
// import { StreamResponseComponentProps } from "@/types/chat"; // Import the type

interface Button {
  id: string;
  label: string;
}

interface Category {
  name: string;
  buttons: Button[];
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

import { ResponseRendererProps } from "@nlux/react"; // Import the correct type

const MyCustomRenderer: FC<ResponseRendererProps<string>> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (props.status === "complete" && props.content) {
      const textContent = props.content.join("");
      const parsedCategories = parseButtons(textContent);
      setCategories(parsedCategories);

      const textWithoutButtons = textContent.replace(
        /<buttons>([^]*?)<\/buttons>/,
        ""
      );
      if (containerRef.current) {
        containerRef.current.innerText = textWithoutButtons;
      }
    }
  }, [props.status, props.content]);

  const handleButtonClick = (buttonId: string) => {
    console.log(`Button clicked: ${buttonId}`);
    // Here, you would likely dispatch an action to handle the button click
    // based on the button ID, e.g., send a message to the chat bot, update state etc.
  };

  return (
    <div>
      <div ref={containerRef} />
      {categories.map((category, catIndex) => (
        <div key={catIndex}>
          <h3>{category.name}</h3>
          {category.buttons.map((button, btnIndex) => (
            <button
              key={`${catIndex}-${btnIndex}`}
              onClick={() => handleButtonClick(button.id)}
            >
              {button.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyCustomRenderer;
