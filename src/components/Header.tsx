import React from 'react';
import Link from 'next/link';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header className="bg-[#0a0a0a] border-b border-gray-800">
      <div className="container mx-auto flex justify-end items-center">
        <Menu 
          mode="horizontal" 
          className="border-0 bg-transparent"
          theme="dark"
          items={[
            {
              key: "about",
              label: <Link href="/about">About</Link>,
            },
            {
              key: "contact",
              label: <Link href="https://forms.gle/LeWyLCdyVfrrMzFM6">Contact</Link>,
            },
          ]}
        />
      </div>
    </Header>
  );
};

export default AppHeader;