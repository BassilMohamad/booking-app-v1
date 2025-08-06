import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signUpWithOwner = async (
  email: string,
  password: string,
  shopName: string
) => {
  if (!shopName || !email || !password) {
    throw new Error("All fields are required.");
  }

  const slug = shopName.trim().toLowerCase().replace(/\s+/g, "-");

  // ✅ Check if shop with same slug exists
  const shopRef = doc(db, "shops", slug);
  const shopSnap = await getDoc(shopRef);
  if (shopSnap.exists()) {
    throw new Error("A shop with this name already exists.");
  }

  // ✅ Create owner account
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // ✅ Create shop document
  await setDoc(shopRef, {
    name: shopName,
    slug: slug,
    ownerId: user.uid,
    address: "",
    openingHours: { start: "", end: "" },
    services: [],
    barbers: [],
    createdAt: Date.now(),
    email,
  });

  return { uid: user.uid, shopId: slug };
};

// Sign in
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const logOut = () => {
  return signOut(auth);
};
