import { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Spin, Empty, Form, Button, Input } from 'antd';
import { Scenario } from '@/types/scenario';
import { extractModelCharacteristics, isScenarioCompatible } from '@/utils/model-matcher';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

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
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [form] = Form.useForm();

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
          const compatible = data.scenarios.filter((scenario: Scenario) => 
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
      setShowCustomForm(false);
      form.resetFields();
    }
  }, [isOpen, modelSystemPrompt, form]);

  const handleCustomSubmit = async (values: any) => {
    const customScenario: Scenario = {
      source: [{
        age: ["adult"],
        gender: ["man", "woman"]
      }],
      target: [{
        age: ["adult"],
        gender: ["man", "woman"]
      }],
      relationship: ["custom"],
      setting: ["custom"],
      scenario_description: values.description,
      popularity_score: 0
    };

    onSelect(customScenario);
  };

  const renderCustomForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleCustomSubmit}
      className="p-4"
    >
      <Form.Item
        label="Describe Your Scenario"
        name="description"
        rules={[{ required: true, message: 'Please describe your scenario' }]}
      >
        <TextArea 
          rows={6} 
          placeholder="Describe your scenario in detail. For example: Two old friends reuniting after years apart, catching up over coffee and sharing life updates..."
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Scenario
        </Button>
        <Button 
          onClick={() => setShowCustomForm(false)} 
          className="ml-2"
        >
          Back to Templates
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      title={showCustomForm ? "Create Custom Scenario" : "Choose Your Scenario"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      {showCustomForm ? (
        renderCustomForm()
      ) : loading ? (
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
          {/* Existing Scenarios */}
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
              </Card>
            </Col>
          ))}
          
          {/* Create Your Own Card - Moved to the end */}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => setShowCustomForm(true)}
              className="h-full cursor-pointer transition-all hover:scale-105 bg-gradient-to-r from-blue-50 to-blue-100"
              >
                <div className="flex flex-col h-full text-center">
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-black">Create Your Own</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <PlusOutlined className="text-2xl text-black" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-500">
                      Describe your own scenario and act it out
                    </p>
                  </div>
                </div>
            </Card>
          </Col>
        </Row>
      )}
    </Modal>
  );
};
