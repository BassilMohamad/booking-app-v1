import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";

interface Booking {
  barberId: string;
  date: string;
  time: string;
}

interface ShopData extends DocumentData {
  bookings?: Booking[];
}

export function useBookedSlots(
  shopSlug: string,
  barberId: string,
  date?: string
) {
  return useQuery<string[]>({
    queryKey: ["bookedSlots", shopSlug, barberId, date],
    enabled: !!date,
    queryFn: async () => {
      const shopRef = doc(db, "shops", shopSlug);
      const shopSnap = await getDoc(shopRef);

      if (!shopSnap.exists()) return [];

      const shopData = shopSnap.data() as ShopData;
      const bookings = shopData.bookings ?? [];

      return bookings
        .filter((b) => b.barberId === barberId && b.date === date)
        .map((b) => b.time);
    },
  });
}
