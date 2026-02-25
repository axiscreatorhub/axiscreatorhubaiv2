/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import OnboardingPage from './pages/app/Onboarding';
import HooksPage from './pages/app/Hooks';
import AssetsPage from './pages/app/Assets';
import BillingPage from './pages/app/Billing';

// Wrapper to conditionally render ClerkProvider or just children (for Mock Auth)
function AuthProvider({ children }: { children: React.ReactNode }) {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (clerkKey) {
    return (
      <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
        {children}
      </ClerkProvider>
    );
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout><OnboardingPage /></DashboardLayout>} path="onboarding" />
            <Route element={<DashboardLayout><HooksPage /></DashboardLayout>} index /> {/* Default to Hooks or Overview */}
            <Route element={<DashboardLayout><HooksPage /></DashboardLayout>} path="hooks" />
            <Route element={<DashboardLayout><AssetsPage /></DashboardLayout>} path="assets" />
            <Route element={<DashboardLayout><BillingPage /></DashboardLayout>} path="billing" />
          </Route>

          {/* Legacy Redirects */}
          <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
