// app/login/page.tsx
import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>
        <LoginButton />
      </div>
    </div>
  )
}