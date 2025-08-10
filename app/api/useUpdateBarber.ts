import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export interface WorkingDay {
  available: boolean;
  start: string;
  end: string;
}

export interface BarberNewData {
  id: string;
  name: string;
  photo?: string;
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
}

interface UpdateBarberArgs {
  shopSlug: string;
  barber: BarberNewData;
}

export const useUpdateBarber = () => {
  return useMutation<void, Error, UpdateBarberArgs>({
    mutationFn: async ({ shopSlug, barber }) => {
      const shopRef = doc(db, "shops", shopSlug);
      const shopSnap = await getDoc(shopRef);

      if (!shopSnap.exists()) {
        throw new Error("Shop not found");
      }

      const shopData = shopSnap.data();
      const barbers = shopData.barbers || [];

      const updatedBarbers = barbers.map((b: BarberNewData) =>
        b.id === barber.id ? barber : b
      );

      await updateDoc(shopRef, { barbers: updatedBarbers });
    },
  });
};
