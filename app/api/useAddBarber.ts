import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

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

interface AddBarberArgs {
  shopSlug: string;
  barber: BarberNewData;
}

export const useAddBarber = () => {
  return useMutation<void, Error, AddBarberArgs>({
    mutationFn: async ({ shopSlug, barber }) => {
      const shopRef = doc(db, "shops", shopSlug);
      await updateDoc(shopRef, {
        barbers: arrayUnion(barber),
      });
    },
  });
};
