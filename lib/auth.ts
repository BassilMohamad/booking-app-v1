import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Sign up
export const signUpWithBarber = async (
  email: string,
  password: string,
  barberName: string
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  const slug = barberName.trim().toLowerCase().replace(/\s+/g, "-");

  await setDoc(doc(db, "barbers", user.uid), {
    uid: user.uid,
    email: user.email,
    barberName,
    slug,
    createdAt: Date.now(),
  });
};

// Sign in
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const logOut = () => {
  return signOut(auth);
};
