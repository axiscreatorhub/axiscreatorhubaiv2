import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

// Mock User Hook
const useMockUser = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return {
    isLoaded,
    isSignedIn: true,
    user: {
      id: 'mock_user_123',
      fullName: 'Preview User',
      primaryEmailAddress: { emailAddress: 'preview@example.com' },
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Preview',
    }
  };
};

export const useAppUser = () => {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (clerkKey) {
    return useUser();
  }
  
  return useMockUser();
};
