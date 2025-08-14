import { getClientId } from "@/hooks/getClientId";
import { useMutation } from "@tanstack/react-query";

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
      const res = await fetch("/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopSlug, booking, clientId: getClientId() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create booking");
      }
    },
  });
};
