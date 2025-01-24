import React from "react";

const CharacterSelect = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-2xl font-semibold mb-4">Select a Character</h1>
        <div className="space-y-4 text-white">
          <p>To start talking:</p>
          <ol className="text-left list-decimal pl-6 space-y-2">
            <li>
              Choose a character from the available options on the home page
            </li>
            <li>Click on the character card to start a conversation</li>
            <li>
              Use the floating menu button to:
              <ul className="list-disc pl-6 mt-1">
                <li>Select different conversation scenarios</li>
                <li>Clear chat history</li>
              </ul>
            </li>
            <li>Type your message in the input box and press enter to send</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;
