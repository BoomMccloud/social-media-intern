import React from 'react';
import Link from 'next/link';
import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="bg-[#0a0a0a] border-t border-gray-800">
      <div className="container mx-auto">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <h3 className="text-lg font-semibold mb-4 text-[#F8BBD0]">About Us</h3>
            <p className="text-gray-400">
            AI Playmates is a generative AI platform that allows users to create and interact generated characters for role playing purposes..
            </p>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="text-lg font-semibold mb-4 text-[#F8BBD0]">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Home</Link></li>
              <li><Link href="/chat" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Chats</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">About Us</Link></li>
              <li><Link href="https://forms.gle/LeWyLCdyVfrrMzFM6" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Contact</Link></li>
            </ul>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="text-lg font-semibold mb-4 text-[#F8BBD0]">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/tos" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Terms of Service</Link></li>
            </ul>
          </Col>
        </Row>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 AI Playmate. All rights reserved.</p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;