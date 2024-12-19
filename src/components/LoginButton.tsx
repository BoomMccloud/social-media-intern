// app/login/LoginButton.tsx
'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { 
        callbackUrl: "/dashboard",
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label="Sign in with Google"
      role="button"
      className={`
        w-full px-4 py-2 
        bg-blue-600 text-white 
        rounded-md 
        hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {isLoading ? (
        <span className="inline-block">Loading...</span>
      ) : (
        <>
          <svg 
            className="w-5 h-5" 
            aria-hidden="true" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
          </svg>
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  )
}