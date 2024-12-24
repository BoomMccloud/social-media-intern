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
            <h3 className="text-lg font-semibold mb-4 text-[#F8BBD0]">About eStore</h3>
            <p className="text-gray-400">
              eStore is your one-stop shop for all your online shopping needs. We offer a wide range of high-quality products at competitive prices, with excellent customer service and fast shipping.
            </p>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="text-lg font-semibold mb-4 text-[#F8BBD0]">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Contact</Link></li>
            </ul>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="text-lg font-semibold mb-4 text-[#F8BBD0]">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Returns</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-[#F8BBD0] transition-colors">Privacy Policy</Link></li>
            </ul>
          </Col>
        </Row>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 eStore. All rights reserved.</p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;