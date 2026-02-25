import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
  // If no Clerk key, redirect to app (Mock Auth handles it)
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    window.location.href = '/app';
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="font-bold text-black">A</span>
        </div>
        <span className="font-bold text-xl text-white tracking-tight">AXIS</span>
      </Link>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" redirectUrl="/app/onboarding" />
    </div>
  );
}
