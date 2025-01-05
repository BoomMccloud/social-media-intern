"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import EmailLogin from "@/components/EmailLogin";

interface SocialLoginButtonProps {
  provider: string;
  icon: ReactNode;
  label: string;
}

interface DividerProps {
  text: string;
}

// Generic social login button content component
function SocialLoginButtonContent({
  provider,
  icon,
  label,
}: SocialLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      console.log(
        `Login attempted with ${provider} and callback URL:`,
        callbackUrl
      );

      await signIn(provider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label={`Sign in with ${label}`}
      role="button"
      className={`
        w-full px-4 py-2 
        bg-blue-600 text-white 
        rounded-md 
        hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        mb-3
      `}
    >
      {isLoading ? (
        <span className="inline-block">Loading...</span>
      ) : (
        <>
          {icon}
          <span>Sign in with {label}</span>
        </>
      )}
    </button>
  );
}

// Loading fallback
function LoadingButton() {
  return (
    <button
      disabled
      className={`
        w-full px-4 py-2 
        bg-blue-600 text-white 
        rounded-md 
        opacity-50 cursor-not-allowed
        flex items-center justify-center gap-2
        mb-3
      `}
    >
      <span className="inline-block">Loading...</span>
    </button>
  );
}

// Provider-specific icons
const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const GithubIcon = () => (
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Divider component
function Divider({ text }: DividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-600"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-[#0f0f10] text-gray-400">{text}</span>
      </div>
    </div>
  );
}

// Main component with all login options
export default function LoginOptions() {
  return (
    <div className="space-y-2">
      <EmailLogin />

      <Divider text="Or continue with" />

      <div className="space-y-2">
        <Suspense fallback={<LoadingButton />}>
          <SocialLoginButtonContent
            provider="google"
            icon={<GoogleIcon />}
            label="Google"
          />
        </Suspense>
      </div>
    </div>
  );
}
