import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

// Define what a booking looks like
interface Booking {
  barberId: string;
  customerName: string;
  service: string[];
  date: string;
  time: string;
  customerPhoneNumber?: string;
}

interface AddBookingArgs {
  shopSlug: string;
  booking: Booking;
}

export const useAddBooking = () => {
  return useMutation<void, Error, AddBookingArgs>({
    mutationFn: async ({ shopSlug, booking }) => {
      const shopRef = doc(db, "shops", shopSlug);
      await updateDoc(shopRef, {
        bookings: arrayUnion(booking),
      });
    },
  });
};
