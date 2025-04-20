import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth"; // Importing required Firebase methods
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  limit,
  getDocs
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const linkedinProvider = new OAuthProvider('linkedin.com');

// Sign-in with Google using redirect
export const signInWithGoogleRedirect = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error during Google sign-in redirect:", error);
  }
};

// Handle redirect result after the user is redirected back from Google sign-in
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      // Create or fetch the user document in Firestore
      await createUserDocument(user);
      console.log("User signed in with redirect:", user);
    }
  } catch (error) {
    console.error("Error handling redirect result:", error);
  }
};

// Create a user document in Firestore
export const createUserDocument = async (user, referralCode = null) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;

    try {
      await setDoc(userRef, {
        uid: user.uid,
        name: displayName,
        email,
        photoURL,
        coins: 0,
        referralCount: 0,
        referralCode: generateReferralCode(user.uid),
        referredBy: referralCode || "direct",
        dailySpinUsedOn: null,
        streakCount: 0,
        lastLoginDate: null,
        createdAt: new Date()
      });

      // Update referrer's data if applicable
      if (referralCode && referralCode !== "direct") {
        const referrerQuery = query(
          collection(db, "users"),
          where("referralCode", "==", referralCode),
          limit(1)
        );

        const referrerSnapshot = await getDocs(referrerQuery);
        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          await updateDoc(referrerDoc.ref, {
            referralCount: increment(1),
            coins: increment(10)
          });
        }
      }
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  }

  return userRef;
};

// Generate a referral code based on user UID
const generateReferralCode = (uid) => {
  return uid.substring(0, 6).toUpperCase();
};

// Update user's last login and streak count
export const updateUserLastLogin = async (userId) => {
  const userRef = doc(db, "users", userId);
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0];

  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const lastLoginDate = userData.lastLoginDate?.toDate();
    const lastLoginDateString = lastLoginDate?.toISOString().split('T')[0];

    let streakCount = userData.streakCount || 0;
    let coinsToAdd = 0;

    if (lastLoginDateString !== todayDateString) {
      // Check if consecutive login
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDateString = yesterday.toISOString().split('T')[0];

      if (lastLoginDateString === yesterdayDateString) {
        streakCount += 1;
      } else {
        streakCount = 1;
      }

      // Add streak bonus
      if (streakCount >= 5) {
        coinsToAdd = 10;
      } else if (streakCount >= 3) {
        coinsToAdd = 5;
      }

      await updateDoc(userRef, {
        lastLoginDate: today,
        streakCount,
        coins: increment(coinsToAdd)
      });
    }

    return { streakCount, coinsAdded: coinsToAdd };
  }
};

// Call handleRedirectResult() when your app initializes (typically in a component mount or app load)
handleRedirectResult();
