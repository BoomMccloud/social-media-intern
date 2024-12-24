import { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Spin, Empty } from 'antd';
import { Scenario } from '@/types/scenario';
import { extractModelCharacteristics, isScenarioCompatible } from '@/utils/model-matcher';

interface ScenarioSelectorProps {
  isOpen: boolean;
  onSelect: (scenario: Scenario) => void;
  onClose: () => void;
  modelSystemPrompt: string;
}

export const ScenarioSelector = ({ 
  isOpen, 
  onSelect, 
  onClose, 
  modelSystemPrompt 
}: ScenarioSelectorProps) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [compatibleScenarios, setCompatibleScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    async function loadScenarios() {
      try {
        console.log('Loading scenarios...');
        const response = await fetch('/api/scenarios');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded scenarios:', data);
        
        setScenarios(data.scenarios || []);
        
        const modelCharacteristics = extractModelCharacteristics(modelSystemPrompt);
        if (modelCharacteristics) {
          const compatible = data.scenarios.filter(scenario => 
            isScenarioCompatible(scenario, modelCharacteristics)
          );
          setCompatibleScenarios(compatible);
        } else {
          setCompatibleScenarios(data.scenarios || []);
        }
      } catch (error) {
        console.error('Error loading scenarios:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadScenarios();
    }
  }, [isOpen, modelSystemPrompt]);

  return (
    <Modal
      title="Choose Your Scenario"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      ) : compatibleScenarios.length === 0 ? (
        <Empty 
          description="No compatible scenarios found for this character" 
          className="py-8"
        />
      ) : (
        <Row gutter={[16, 16]}>
          {compatibleScenarios.map((scenario, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                hoverable
                onClick={() => onSelect(scenario)}
                className="h-full cursor-pointer transition-all hover:scale-105"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {scenario.scenario_description}
                </h3>
                <p className="text-sm text-gray-500">
                  Setting: {scenario.setting.join(', ')}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Modal>
  );
};
