import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function SignInPage() {
  // If no Clerk key, redirect to app (Mock Auth handles it)
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    window.location.href = '/app';
    return null;
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] rounded-lg flex items-center justify-center">
          <span className="font-bold text-white">A</span>
        </div>
        <span className="font-bold text-xl text-white tracking-tight">AXIS</span>
      </Link>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" redirectUrl="/app" />
    </div>
  );
}
