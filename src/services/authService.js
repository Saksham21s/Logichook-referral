// src/services/authService.js
import { 
    auth, 
    googleProvider, 
    githubProvider, 
    linkedinProvider, 
    db 
  } from '../firebase';
  import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  
  export const createUserDocument = async (user) => {
    if (!user) return null;
  
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      const userData = {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        role: 'user',
        coins: 0,
        referralCount: 0,
        streakCount: 0
      };
  
      await setDoc(userRef, userData);
      return { uid: user.uid, ...userData };
    }
  
    const userData = userSnap.data();
    await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
    return { uid: user.uid, ...userData };
  };
  
  export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userData = await createUserDocument(result.user);
    return userData;
  };
  
  export const signInWithGithub = async () => {
    const result = await signInWithPopup(auth, githubProvider);
    const userData = await createUserDocument(result.user);
    return userData;
  };
  
  export const signInWithLinkedIn = async () => {
    const result = await signInWithPopup(auth, linkedinProvider);
    const userData = await createUserDocument(result.user);
    return userData;
  };
  
  export const signInWithEmailPassword = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = await createUserDocument(result.user);
    return userData;
  };
  
  export const signUpWithEmailPassword = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userData = await createUserDocument(result.user);
    return userData;
  };
  
  export const logoutUser = async () => {
    await signOut(auth);
  };