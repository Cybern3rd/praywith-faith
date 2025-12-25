import { useUser, useClerk } from '@clerk/clerk-react';

export function useClerkAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();

  return {
    user: user ? {
      id: user.id,
      name: user.fullName || user.firstName || 'User',
      email: user.primaryEmailAddress?.emailAddress || '',
      imageUrl: user.imageUrl,
    } : null,
    isLoaded,
    isSignedIn: !!isSignedIn,
    signOut: () => signOut(),
    signIn: () => openSignIn(),
  };
}
