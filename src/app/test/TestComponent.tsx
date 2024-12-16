// src/app/test/TestComponent.tsx
"use client"

import { useState } from 'react';

export default function TestComponent() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState('');
  const [systemMessage, setSystemMessage] = useState('You are a bird and only say polly wants a cracker');
  const [userMessage, setUserMessage] = useState('What can you help me with?');

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: systemMessage,
          user: userMessage,
        }),
      });

      const rawText = await response.text();
      setRawResponse(rawText);

      if (rawText.trim().startsWith('{')) {
        const data = JSON.parse(rawText);
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setResponse('Received non-JSON response');
      }
    } catch (error: any) {
      setResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          System Message:
        </label>
        <textarea
          value={systemMessage}
          onChange={(e) => setSystemMessage(e.target.value)}
          className="w-full p-2 border text-black rounded-md"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          User Message:
        </label>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="w-full p-2 border text-black rounded-md"
          rows={3}
        />
      </div>

      <button 
        onClick={testAPI}
        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      
      {loading && <p className="mt-4">Loading...</p>}
      
      <div className="mt-6">
        <h3 className="font-medium">Parsed Response:</h3>
        <pre className="mt-2 p-4 bg-gray-100 text-black rounded">
          {response}
        </pre>
      </div>

      <div className="mt-6">
        <h3 className="font-medium">Raw Response:</h3>
        <pre className="mt-2 p-4 bg-gray-100 text-black rounded">
          {rawResponse}
        </pre>
      </div>
    </div>
  );
}