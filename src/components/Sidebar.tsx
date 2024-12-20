// src/components/Sidebar.tsx
"use client";

import { Layout, Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { HomeOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [getItem("Home", "/", <HomeOutlined />)];

// const siderStyle: React.CSSProperties = {
//   height: "100vh",
//   position: "sticky",
//   top: 0,
//   bottom: 0,
//   scrollbarWidth: "thin",
//   scrollbarGutter: "stable",
// };

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/login");
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
  };

  // const renderAuthButton = () => {
  //   if (status === "loading") {
  //     return (
  //       <button
  //         disabled
  //         className="mb-2 w-full py-2 px-4 bg-gray-600 text-white rounded flex items-center justify-center gap-2 cursor-not-allowed"
  //       >
  //         Loading...
  //       </button>
  //     );
  //   }

  //   if (session) {
  //     return (
  //       <button
  //         onClick={handleSignOut}
  //         className="mb-2 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-2"
  //       >
  //         <LogoutOutlined />
  //         {!collapsed && "Sign out"}
  //       </button>
  //     );
  //   }

  //   return (
  //     <button
  //       onClick={handleSignIn}
  //       className="mb-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2"
  //     >
  //       <LoginOutlined />
  //       {!collapsed && "Sign in"}
  //     </button>
  //   );
  // };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="md"
      zeroWidthTriggerStyle={{ background: "red" }}
    >
      <div className="flex flex-col justify-between p-2 h-full">
        <Menu
          theme="dark"
          defaultSelectedKeys={["home"]}
          mode="inline"
          items={items}
          onClick={({ key }: { key: string }) => {
            router.push(key);
          }}
        />
        <Button
          className="mb-2"
          icon={session ? <LogoutOutlined /> : <LoginOutlined />}
          onClick={session ? handleSignOut : handleSignIn}
          loading={status === "loading"}
          type="primary"
          block
          variant="outlined"
          color="primary"
        >
          {!collapsed && (session ? "Sign out" : "Sign in")}
        </Button>
      </div>
    </Sider>
  );
};
