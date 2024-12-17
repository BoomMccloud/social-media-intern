// src/app/config/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ModelConfig } from '@/types/chat';
import { DEFAULT_MODELS } from '@/config/default-models';
import { invalidateModelConfig } from '@/app/chat/stream';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export default function TestPage() {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Failed to load configuration');
      const config = await response.json();
      
      const updatedConfig = config.map((model: ModelConfig) => ({
        ...model,
        configId: model.configId || `config-${crypto.randomUUID()}`
      }));
      
      setModels(updatedConfig);
      setSelectedModel(updatedConfig.find((m: ModelConfig) => m.isActive) || updatedConfig[0]);
    } catch (error) {
      console.error('Error loading configuration:', error);
      const defaultModels = DEFAULT_MODELS.map(model => ({
        ...model,
        configId: `config-${crypto.randomUUID()}`
      }));
      setModels(defaultModels);
      setSelectedModel(defaultModels.find(m => m.isActive) || defaultModels[0]);
    }
  };

  const handleModelChange = (configId: string) => {
    const model = models.find(m => m.configId === configId);
    if (model) {
      setSelectedModel({ ...model });
    }
  };

  const setActiveModel = async (configId: string) => {
    const updatedModels = models.map(model => ({
      ...model,
      isActive: model.configId === configId
    }));
    
    // Save and refresh when setting active model
    handleSave(updatedModels, true);
  };

  const addNewModel = () => {
    const newModel: ModelConfig = {
      configId: `config-${crypto.randomUUID()}`,
      modelId: '',
      name: 'New Model',
      systemPrompt: 'You are a helpful AI assistant.',
      temperature: 0.7,
      maxTokens: 1000,
      isActive: false
    };
    
    setModels([...models, newModel]);
    setSelectedModel(newModel);
  };

  const deleteModel = (configId: string) => {
    if (models.length <= 1) {
      alert('Cannot delete the last model');
      return;
    }
    
    const modelToDelete = models.find(m => m.configId === configId);
    const updatedModels = models.filter(m => m.configId !== configId);
    
    if (modelToDelete?.isActive && updatedModels.length > 0) {
      updatedModels[0].isActive = true;
    }
    
    setModels(updatedModels);
    if (selectedModel?.configId === configId) {
      setSelectedModel(updatedModels[0]);
    }
    handleSave(updatedModels);
  };

  const handleSave = async (modelsToSave = models, forceRefresh = false) => {
    setSaveStatus('saving');
    try {
      let updatedModels = modelsToSave;
      if (modelsToSave === models && selectedModel) {
        updatedModels = models.map(model => 
          model.configId === selectedModel.configId ? selectedModel : model
        );
      }

      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModels),
      });

      if (!response.ok) throw new Error('Failed to save configuration');

      setModels(updatedModels);
      setSaveStatus('success');
      
      // Only invalidate if it's forced or if we're saving the active model
      if (forceRefresh || selectedModel?.isActive) {
        invalidateModelConfig();
      }
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getSaveButtonText = () => {
    // Different text for active model
    if (selectedModel?.isActive) {
      switch (saveStatus) {
        case 'saving': return 'Saving & Refreshing...';
        case 'success': return 'Saved & Refreshed!';
        case 'error': return 'Error Saving';
        default: return 'Save & Refresh Model';
      }
    }
    
    // Normal save text for inactive models
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'success': return 'Saved!';
      case 'error': return 'Error Saving';
      default: return 'Save Configuration';
    }
  };

  const getSaveButtonClass = () => {
    const baseClass = 'px-4 py-2 rounded transition-colors';
    if (saveStatus === 'saving') {
      return `${baseClass} bg-yellow-500 text-white cursor-not-allowed`;
    }
    if (saveStatus === 'success') {
      return `${baseClass} bg-green-500 text-white`;
    }
    if (saveStatus === 'error') {
      return `${baseClass} bg-red-500 text-white`;
    }
    
    // Different color for active model save button
    return selectedModel?.isActive
      ? `${baseClass} bg-purple-500 text-white hover:bg-purple-600`
      : `${baseClass} bg-blue-500 text-white hover:bg-blue-600`;
  };

  

  const renderModelSelector = () => (
    <div className="flex items-center gap-4 mb-4">
      <select
        value={selectedModel?.configId}
        onChange={(e) => handleModelChange(e.target.value)}
        className="flex-grow p-2 border rounded text-black"
      >
        {models.map((model) => (
          <option key={model.configId} value={model.configId}>
            {model.name} {model.isActive ? '(Active)' : ''}
          </option>
        ))}
      </select>
      <button
        onClick={() => selectedModel && setActiveModel(selectedModel.configId)}
        disabled={selectedModel?.isActive}
        className={`px-4 py-2 rounded ${
          selectedModel?.isActive
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        Set as Active
      </button>
      <button
        onClick={addNewModel}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Model
      </button>
      <button
        onClick={() => selectedModel && deleteModel(selectedModel.configId)}
        disabled={models.length <= 1}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
      >
        Delete
      </button>
    </div>
  );

  const renderModelForm = () => {
    if (!selectedModel) {
      return (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
          No model configuration selected.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Model ID:</label>
          <input
            type="text"
            value={selectedModel.modelId}
            onChange={(e) => {
              setSelectedModel({ ...selectedModel, modelId: e.target.value });
            }}
            className="w-full p-2 border rounded text-black"
            placeholder="Enter model ID (e.g., meta-llama/llama-3.2-1b-instruct)"
          />
        </div>

        <div>
          <label className="block mb-2">Configuration ID:</label>
          <input
            type="text"
            value={selectedModel.configId}
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block mb-2">Model Name:</label>
          <input
            type="text"
            value={selectedModel.name}
            onChange={(e) => {
              setSelectedModel({ ...selectedModel, name: e.target.value });
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2">System Prompt:</label>
          <textarea
            value={selectedModel.systemPrompt}
            onChange={(e) => {
              setSelectedModel({ ...selectedModel, systemPrompt: e.target.value });
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
              setSelectedModel({ 
                ...selectedModel, 
                temperature: parseFloat(e.target.value) 
              });
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
              setSelectedModel({ 
                ...selectedModel, 
                maxTokens: parseInt(e.target.value) 
              });
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleSave()}
            disabled={saveStatus === 'saving'}
            className={getSaveButtonClass()}
          >
            {getSaveButtonText()}
          </button>

          {/* Optional: Add a visual indicator for active model */}
          {selectedModel.isActive && (
            <span className="text-sm text-purple-600">
              ⚡ Active model changes will refresh immediately
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderErrorMessage = () => {
    if (saveStatus !== 'error') return null;

    return (
      <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
        Failed to save configuration. Please try again.
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Model Configuration Tester</h1>
      <div className="mb-6">
        {renderModelSelector()}
        {renderModelForm()}
        {renderErrorMessage()}
      </div>
    </div>
  );
}