import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export function useBarberSlug() {
  const { user } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlug = async () => {
      if (user) {
        try {
          const shopsRef = collection(db, "shops");
          const q = query(shopsRef, where("ownerId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const shopData = querySnapshot.docs[0].data(); // First shop
            setSlug(shopData.slug);
          } else {
            console.warn("No shop found for this user.");
          }
        } catch (error) {
          console.error("Error fetching slug:", error);
        }
      }
    };
    fetchSlug();
  }, [user]);

  return slug;
}
