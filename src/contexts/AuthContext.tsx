import { createContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { auth, firestore } from "@/services/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useSessionStorage from "@/hook/useSessionStorage";

type User = {
  uid: string;
  email: string;
  metadata: {
    lastSignInTime?: string;
  };
};

type LoginData = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  expiresAt: number;
  error: string | null;
  signIn: (data: LoginData) => Promise<void>;
  signUp: (data: LoginData) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useSessionStorage<User | null>("user", null);
  const [expiresAt, setExpiresAt] = useSessionStorage<number>("expiresAt", 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async ({ email, password }: LoginData) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { uid, metadata } = result.user;
      setUser({ uid, email, metadata });
      setExpiresAt(Date.now() + 15 * 60 * 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const signUp = async ({ email, password }: LoginData) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, metadata } = result.user;
      setUser({ uid, email, metadata });
      createUser({ uid, email });
      setExpiresAt(Date.now() + 15 * 60 * 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await signOutFirebase(auth);
      setUser(null);
      setExpiresAt(0);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Adds user to Firestore database
  const createUser = async ({ email, uid }: { email: string; uid: string }) => {
    try {
      const userRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) throw new Error("User already exists");

      await setDoc(userRef, {
        email: email,
        favorites: [],
        ratings: [],
      });
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 10 * 1000);
  }, [error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        expiresAt,
        loading,
        signIn,
        signOut,
        signUp,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
