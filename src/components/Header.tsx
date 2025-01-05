"use client";

import { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  HomeOutlined,
  WechatWorkOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";

const { Header } = Layout;

const AppHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignIn = () => {
    router.push("/auth/login");
    setDrawerOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/";
    }
    setDrawerOpen(false);
  };

  const navItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/chat",
      icon: <WechatWorkOutlined />,
      label: "Chat",
    },
    {
      key: "about",
      label: "About",
    },
    {
      key: "contact",
      label: "Contact",
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === "/" || key === "/chat") {
      router.push(key);
    } else if (key === "about") {
      router.push("/about");
    } else if (key === "contact") {
      window.open("https://forms.gle/LeWyLCdyVfrrMzFM6", "_blank");
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <Header className="bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center px-4 fixed w-full z-50">
        <div className="text-xl font-bold flex flex-col sm:flex-row items-start sm:items-center">
          <span className="text-[#F8BBD0]">AI Playmates</span>
          <span className="text-white sm:ml-2">Unleash Your Imagination</span>
        </div>
        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          type="text"
          className="text-[#F8BBD0]"
        />
      </Header>

      <Drawer
        // title="Menu"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        className="bg-[#0a0a0a]"
        styles={{
          header: {
            borderBottom: "1px solid #1f1f1f",
            background: "#0a0a0a",
            color: "#F8BBD0",
          },
          body: {
            background: "#0a0a0a",
            padding: 0,
          },
        }}
      >
        <Menu
          mode="vertical"
          className="bg-transparent border-0"
          theme="dark"
          selectedKeys={[pathname]}
          items={navItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
        <div className="px-4 pt-4 border-t border-gray-800">
          <Button
            icon={session ? <LogoutOutlined /> : <LoginOutlined />}
            onClick={session ? handleSignOut : handleSignIn}
            loading={status === "loading"}
            type="primary"
            block
          >
            {session ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default AppHeader;
