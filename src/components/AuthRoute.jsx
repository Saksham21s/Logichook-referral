import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, googleProvider, createUserDocument } from '../firebase';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get('ref') || null;

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await createUserDocument(result.user, referralCode);
          navigate('/dashboard');
        } else if (auth.currentUser) {
          // If already logged in, just navigate
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Google Sign-in Error:', error.message);
      }
    };

    handleRedirectResult();
  }, [navigate, referralCode]);

  const handleGoogleSignIn = () => {
    signInWithRedirect(auth, googleProvider);
  };

  return (
    <div className="auth-container">
      <h2>Login or Sign Up</h2>
      <button onClick={handleGoogleSignIn}>Continue with Google</button>
    </div>
  );
};

export default Auth;
