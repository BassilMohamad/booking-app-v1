import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface DeleteBarberArgs {
  shopSlug: string;
  barberId: string;
}

export const useDeleteBarber = () => {
  return useMutation<void, Error, DeleteBarberArgs>({
    mutationFn: async ({ shopSlug, barberId }) => {
      const shopRef = doc(db, "shops", shopSlug);

      // Get current shop document
      const shopSnap = await getDoc(shopRef);
      if (!shopSnap.exists()) {
        throw new Error("Shop not found");
      }

      const shopData = shopSnap.data();
      const currentBarbers = shopData.barbers || [];

      // Filter out the barber to delete
      const updatedBarbers = currentBarbers.filter(
        (barber: { id: string }) => barber.id !== barberId
      );

      // Update the barbers array in Firestore
      await updateDoc(shopRef, {
        barbers: updatedBarbers,
      });
    },
  });
};
