import React from 'react';
import Link from 'next/link';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header className="bg-[#0a0a0a] border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#F8BBD0]">
          Home
        </Link>
        <Menu 
          mode="horizontal" 
          className="border-0 bg-transparent"
          theme="dark"
          items={[
            {
              key: "products",
              label: <Link href="/products">Products</Link>,
            },
            {
              key: "about",
              label: <Link href="/about">About</Link>,
            },
            {
              key: "contact",
              label: <Link href="/contact">Contact</Link>,
            },
          ]}
        />
      </div>
    </Header>
  );
};

export default AppHeader;