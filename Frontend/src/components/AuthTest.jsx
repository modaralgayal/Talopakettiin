import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export function AuthTest() {
  const { user, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading authentication state...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Authentication Test</h2>
      
      {user ? (
        <div>
          <p className="mb-2">Signed in as: {user.email}</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">Not signed in</p>
          <button
            onClick={handleGoogleSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
} 