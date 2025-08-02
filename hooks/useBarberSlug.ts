import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export function useBarberSlug() {
  const { user } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlug = async () => {
      if (user) {
        const barberRef = doc(db, "barbers", user.uid);
        const barberSnap = await getDoc(barberRef);
        if (barberSnap.exists()) {
          const data = barberSnap.data();
          setSlug(data.slug);
        }
      }
    };

    fetchSlug();
  }, [user]);

  return slug;
}
