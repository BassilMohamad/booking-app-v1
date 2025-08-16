import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

interface DeleteBookingArgs {
  shopSlug: string;
  booking: {
    customerName: string;
    customerPhoneNumber?: string;
    barberId: string;
    service: string[];
    date: string;
    time: string;
  };
}

export const useDeleteBooking = () => {
  return useMutation<void, Error, DeleteBookingArgs>({
    mutationFn: async ({ shopSlug, booking }) => {
      const shopRef = doc(db, "shops", shopSlug);
      await updateDoc(shopRef, {
        bookings: arrayRemove(booking),
      });
    },
  });
};
