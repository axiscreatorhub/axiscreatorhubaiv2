/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import OnboardingPage from './pages/app/Onboarding';
import HomePage from './pages/app/Home';
import CreatePage from './pages/app/Create';
import EditPage from './pages/app/Edit';
import AssistPage from './pages/app/Assist';
import PublishPage from './pages/app/Publish';
import MonetizePage from './pages/app/Monetize';

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
            <Route element={<DashboardLayout><HomePage /></DashboardLayout>} index />
            <Route element={<DashboardLayout><CreatePage /></DashboardLayout>} path="create" />
            <Route element={<DashboardLayout><EditPage /></DashboardLayout>} path="edit" />
            <Route element={<DashboardLayout><AssistPage /></DashboardLayout>} path="assist" />
            <Route element={<DashboardLayout><PublishPage /></DashboardLayout>} path="publish" />
            <Route element={<DashboardLayout><MonetizePage /></DashboardLayout>} path="monetize" />
          </Route>

          {/* Legacy Redirects */}
          <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/app/hooks" element={<Navigate to="/app/create" replace />} />
          <Route path="/app/assets" element={<Navigate to="/app/create" replace />} />
          <Route path="/app/billing" element={<Navigate to="/app/monetize" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
