import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SignUpData {
  email: string;
  password: string;
  shopName: string;
}

interface SignUpResponse {
  uid: string;
  shopId: string;
}

export const useSignUpWithOwner = () => {
  const queryClient = useQueryClient();

  return useMutation<SignUpResponse, Error, SignUpData>({
    mutationFn: async ({ email, password, shopName }) => {
      if (!shopName || !email || !password) {
        throw new Error("All fields are required.");
      }

      const slug = shopName.trim().toLowerCase().replace(/\s+/g, "-");

      // Check if shop with same slug exists
      const shopRef = doc(db, "shops", slug);
      const shopSnap = await getDoc(shopRef);
      if (shopSnap.exists()) {
        throw new Error("A shop with this name already exists.");
      }

      // Create owner account
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // Create shop document
      await setDoc(shopRef, {
        name: shopName,
        slug: slug,
        ownerId: user.uid,
        services: [],
        barbers: [],
        createdAt: Date.now(),
        email,
        bookings: [],
      });

      return { uid: user.uid, shopId: slug };
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["user", data.uid] });
      queryClient.invalidateQueries({ queryKey: ["shop", data.shopId] });
    },
    mutationKey: ["sign-up"],
  });
};
