// lib/queries/getShopBySlug.ts
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface Booking {
  customerName: string;
  customerPhoneNumber?: string;
  barberId: string;
  service: string[];
  date: string;
  time: string;
}
export interface WorkingDay {
  available: boolean;
  start: string;
  end: string;
}
export interface Barber {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  workingHours: {
    mon: WorkingDay;
    tue: WorkingDay;
    wed: WorkingDay;
    thu: WorkingDay;
    fri: WorkingDay;
    sat: WorkingDay;
    sun: WorkingDay;
  };
  bookedSlots: string[];
}

export interface OpeningHours {
  start: string;
  end: string;
}
export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface Shop {
  email: string;
  openingHours: OpeningHours;
  barbers: Barber[];
  slug: string;
  name: string;
  bookings: Booking[];
  address: string;
  ownerId: string;
  services: Service[];
  createdAt: number;
}

export const getShopBySlug = async (slug: string): Promise<Shop> => {
  const ref = doc(db, "shops", slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Shop not found");
  }

  return snap.data() as Shop;
};
