import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { FacebookAuthProvider } from 'firebase/auth';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createUserDocument = async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          role: 'user'
        });
      } else {
        await setDoc(userRef, {
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error handling user document:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      try {
        setCurrentUser(user || null);
        setError(null);
        
        if (user) {
          await createUserDocument(user);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleAuthError = (error) => {
    let errorMessage = 'An error occurred during authentication';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email is already in use';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Authentication popup was closed';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Authentication popup was blocked';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error occurred. Please check your internet connection';
        break;
      default:
        errorMessage = error.message;
    }
    
    setError(errorMessage);
    return errorMessage;
  };

  const authOperationWrapper = async (operation) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (error) {
      const errorMessage = handleAuthError(error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = (email, password) => 
    authOperationWrapper(() => signInWithEmailAndPassword(auth, email, password));

  const signUpWithEmail = (email, password) => 
    authOperationWrapper(() => createUserWithEmailAndPassword(auth, email, password));

  const signInWithGoogle = () => 
    authOperationWrapper(() => signInWithPopup(auth, googleProvider));

  const signInWithGithub = () => 
    authOperationWrapper(() => signInWithPopup(auth, githubProvider));

  const signInWithLinkedIn = () => 
    authOperationWrapper(() => signInWithPopup(auth, linkedinProvider));

  const logout = () => 
    authOperationWrapper(() => signOut(auth));

  const value = {
    currentUser,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signInWithLinkedIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 