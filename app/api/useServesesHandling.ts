import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import {
  arrayUnion,
  arrayRemove,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// --- Types ---
export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number; // currency unit
  description: string;
}

interface ServiceArgs {
  shopSlug: string;
  service: Service;
}

interface DeleteServiceArgs {
  shopSlug: string;
  serviceId: string;
}

// --- Add Service ---
export const useAddService = () => {
  return useMutation<void, Error, ServiceArgs>({
    mutationFn: async ({ shopSlug, service }) => {
      const shopRef = doc(db, "shops", shopSlug);
      await updateDoc(shopRef, {
        services: arrayUnion(service),
      });
    },
  });
};

// --- Update Service ---
export const useUpdateService = () => {
  return useMutation<void, Error, ServiceArgs>({
    mutationFn: async ({ shopSlug, service }) => {
      const shopRef = doc(db, "shops", shopSlug);
      const snap = await getDoc(shopRef);
      if (!snap.exists()) throw new Error("Shop not found");

      const data = snap.data();
      const updatedServices = (data.services || []).map((s: Service) =>
        s.id === service.id ? service : s
      );

      await updateDoc(shopRef, {
        services: updatedServices,
      });
    },
  });
};

// --- Delete Service ---
export const useDeleteService = () => {
  return useMutation<void, Error, DeleteServiceArgs>({
    mutationFn: async ({ shopSlug, serviceId }) => {
      const shopRef = doc(db, "shops", shopSlug);
      const snap = await getDoc(shopRef);
      if (!snap.exists()) throw new Error("Shop not found");

      const data = snap.data();
      const updatedServices = (data.services || []).filter(
        (s: Service) => s.id !== serviceId
      );

      await updateDoc(shopRef, {
        services: updatedServices,
      });
    },
  });
};
