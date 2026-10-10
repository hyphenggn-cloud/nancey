import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

const OWNER_EMAILS = [
  'harshvardh76655@gmail.com',
  'connect@outshipper.in',
  'nancylogestic@gmail.com'
];
const PRIMARY_OWNER_EMAIL = 'connect@outshipper.in';
const OWNER_STORAGE_KEY = 'outshipper_owner_verified';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  ownerEmail: string;
  ownerModalOpen: boolean;
  openOwnerModal: () => void;
  closeOwnerModal: () => void;
  verifyOwnerPasscode: (code: string) => boolean;
  exitOwnerMode: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  ownerEmail: PRIMARY_OWNER_EMAIL,
  ownerModalOpen: false,
  openOwnerModal: () => {},
  closeOwnerModal: () => {},
  verifyOwnerPasscode: () => false,
  exitOwnerMode: () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnerPasscodeVerified, setIsOwnerPasscodeVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem(OWNER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const userIsAdminEmail = currentUser?.email ? OWNER_EMAILS.includes(currentUser.email.toLowerCase()) : false;
      const effectiveAdmin = userIsAdminEmail || isOwnerPasscodeVerified;
      setIsAdmin(effectiveAdmin);

      if (currentUser) {
        // Sync user profile to Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || 'Enterprise User',
              photoURL: currentUser.photoURL || '',
              companyName: '',
              role: userIsAdminEmail ? 'admin' : 'customer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOwnerPasscodeVerified]);

  const verifyOwnerPasscode = (code: string): boolean => {
    const clean = code.trim().toLowerCase();
    const validKeys = [
      'outshipper',
      'outshipper2026',
      'outshipper2025',
      '9212399003',
      '8000945818',
      'connect@outshipper.in',
      'harshvardh76655',
      'harshvardh76655@gmail.com',
      'nancylogestic@gmail.com',
      'nancylogestic',
      '8053126441',
      'nancy2025',
      'nancy2026',
      'admin123',
      'outshipperpvt'
    ];

    if (validKeys.includes(clean)) {
      try {
        localStorage.setItem(OWNER_STORAGE_KEY, 'true');
      } catch (e) {
        console.warn('Could not persist owner verification flag:', e);
      }
      setIsOwnerPasscodeVerified(true);
      setIsAdmin(true);
      setOwnerModalOpen(false);
      return true;
    }
    return false;
  };

  const exitOwnerMode = () => {
    try {
      localStorage.removeItem(OWNER_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not remove owner verification flag:', e);
    }
    setIsOwnerPasscodeVerified(false);
    if (!user?.email || !OWNER_EMAILS.includes(user.email.toLowerCase())) {
      setIsAdmin(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      exitOwnerMode();
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        ownerEmail: PRIMARY_OWNER_EMAIL,
        ownerModalOpen,
        openOwnerModal: () => setOwnerModalOpen(true),
        closeOwnerModal: () => setOwnerModalOpen(false),
        verifyOwnerPasscode,
        exitOwnerMode,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
