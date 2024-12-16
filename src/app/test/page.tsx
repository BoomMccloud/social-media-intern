'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

const AVAILABLE_MODELS = [
  { id: 'huggingfaceh4/zephyr-7b-beta:free', name: 'zephyr 7b' },
  { id: 'meta-llama/llama-3.2-1b-instruct', name: 'llama 3.2 1b' },
  { id: 'gryphe/mythomax-l2-13b', name: 'Char test' },
];

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef('');

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    currentMessageRef.current = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          modelName: selectedModel,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      // Create initial assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
      };
      setMessages(prev => [...prev, assistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        console.log('Received chunk:', chunk);

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim();
            
            if (data === '[DONE]') {
              console.log('Stream completed');
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              console.log('Parsed message:', parsed);
              
              // Accumulate the content
              currentMessageRef.current += parsed.content;
              
              // Update the last message with accumulated content
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  content: currentMessageRef.current,
                };
                return newMessages;
              });
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-screen p-4 text-black">
      {/* Model selector */}
      <div className="mb-4">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.id} value={model.id} className="text-black">
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`p-4 rounded-lg text-black ${
              m.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-md'
                : 'bg-gray-100 mr-auto max-w-md'
            }`}
          >
            <div className="font-semibold mb-1 text-black">
              {m.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="whitespace-pre-wrap text-black">
              {m.content}
            </div>
            {index === messages.length - 1 && m.role === 'assistant' && isLoading && (
              <div className="text-gray-500 mt-2">▍</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Debug info */}
      <div className="text-xs text-gray-500 mb-2">
        {isLoading ? 'AI is typing...' : 'Ready'}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white p-2">
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'AI is thinking...' : 'Send a message...'}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}