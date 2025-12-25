// This file is kept for backward compatibility
// New code should use @clerk/clerk-react hooks directly:
// - useUser() for user data
// - useAuth() from @clerk/clerk-react for auth state
// - useClerk() for sign in/out actions

import { useUser as useClerkUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const { isSignedIn } = useClerkAuth();

  const state = useMemo(() => {
    // Map Clerk user to our user format
    const user = clerkUser ? {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      name: clerkUser.fullName || clerkUser.username || 'User',
      openId: clerkUser.id,
    } : null;

    return {
      user,
      loading: !isLoaded,
      error: null,
      isAuthenticated: Boolean(isSignedIn && user),
    };
  }, [clerkUser, isLoaded, isSignedIn]);

  return {
    ...state,
    refresh: () => {
      // Clerk handles refresh automatically
      return Promise.resolve({ data: state.user });
    },
    logout: async () => {
      // Clerk sign out is handled by SignOutButton or useClerk().signOut()
      // This is kept for backward compatibility
      console.warn('useAuth().logout() is deprecated. Use Clerk SignOutButton or useClerk().signOut() instead');
    },
  };
}
