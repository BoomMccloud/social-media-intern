import LoginOptions from "@/components/SocialLoginButtons";
import { CheckOutlined } from "@ant-design/icons";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-100">
            Welcome to AI Playmates
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Find your perfect companion
          </p>
        </div>

        <LoginOptions />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0f0f10] text-gray-400">
              Why join AI Playmates?
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <CheckOutlined className="text-blue-400" />
            <span>Discover your AI companions</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <CheckOutlined className="text-blue-400" />
            <span>Explore and replay complex scenarios</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <CheckOutlined className="text-blue-400" />
            <span>Join a community of role playing enthusiasts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
