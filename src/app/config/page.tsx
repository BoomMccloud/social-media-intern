// src/app/config/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ModelConfig } from '@/types/chat';
import { DEFAULT_MODELS } from '@/config/default-models';

export default function TestPage() {
  const [models, setModels] = useState<ModelConfig[]>(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(DEFAULT_MODELS[0]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Load current configuration on mount
  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Failed to load configuration');
      const config = await response.json();
      setModels(config);
      setSelectedModel(config[0]);
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Fallback to default models if loading fails
      setModels(DEFAULT_MODELS);
      setSelectedModel(DEFAULT_MODELS[0]);
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };

  const updateModels = (updatedModel: ModelConfig) => {
    setModels(models.map(model => 
      model.id === updatedModel.id ? updatedModel : model
    ));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Update the models array with the latest selected model changes
      const updatedModels = models.map(model => 
        model.id === selectedModel.id ? selectedModel : model
      );

      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModels),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      setModels(updatedModels);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'success': return 'Saved!';
      case 'error': return 'Error Saving';
      default: return 'Save Configuration';
    }
  };

  const getSaveButtonClass = () => {
    const baseClass = 'px-4 py-2 rounded transition-colors';
    switch (saveStatus) {
      case 'saving':
        return `${baseClass} bg-yellow-500 text-white cursor-not-allowed`;
      case 'success':
        return `${baseClass} bg-green-500 text-white`;
      case 'error':
        return `${baseClass} bg-red-500 text-white`;
      default:
        return `${baseClass} bg-blue-500 text-white hover:bg-blue-600`;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Model Configuration Tester</h1>
      
      <div className="mb-6">
        <label className="block mb-2">Select Model:</label>
        <select
          value={selectedModel.id}
          onChange={(e) => handleModelChange(e.target.value)}
          className="w-full p-2 border rounded text-black"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">Model ID:</label>
          <input
            type="text"
            value={selectedModel.id}
            onChange={(e) => {
              const updated = { ...selectedModel, id: e.target.value };
              setSelectedModel(updated);
              updateModels(updated);
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2">Model Name:</label>
          <input
            type="text"
            value={selectedModel.name}
            onChange={(e) => {
              const updated = { ...selectedModel, name: e.target.value };
              setSelectedModel(updated);
              updateModels(updated);
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2">System Prompt:</label>
          <textarea
            value={selectedModel.systemPrompt}
            onChange={(e) => {
              const updated = { ...selectedModel, systemPrompt: e.target.value };
              setSelectedModel(updated);
              updateModels(updated);
            }}
            className="w-full p-2 border rounded min-h-[100px] text-black"
          />
        </div>

        <div>
          <label className="block mb-2">Temperature:</label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={selectedModel.temperature}
            onChange={(e) => {
              const updated = { ...selectedModel, temperature: parseFloat(e.target.value) };
              setSelectedModel(updated);
              updateModels(updated);
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2">Max Tokens:</label>
          <input
            type="number"
            min="1"
            max="4096"
            value={selectedModel.maxTokens}
            onChange={(e) => {
              const updated = { ...selectedModel, maxTokens: parseInt(e.target.value) };
              setSelectedModel(updated);
              updateModels(updated);
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={getSaveButtonClass()}
        >
          {getSaveButtonText()}
        </button>
      </div>

      {saveStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Failed to save configuration. Please try again.
        </div>
      )}
    </div>
  );
}