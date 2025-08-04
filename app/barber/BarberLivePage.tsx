"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Spinner } from "@/components/ui/Spinner";
import { useParams } from "next/navigation";

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export default function BarberLivePage() {
  const [loading, setLoading] = useState(true);
  const [barberName, setBarberName] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "barbers"), where("slug", "==", slug));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const barber = snapshot.docs[0].data();
          setBarberName(barber.barberName || null);
          setServices(barber.servicesWithPriceAndTime || []);

          setError(null);
        } else {
          setBarberName(null);
          setError("Barber not found.");
        }
        setLoading(false);
      },
      () => {
        setError("Failed to load barber data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [slug]);

  function toggleService(service: Service) {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!barberName)
    return (
      <p className="flex justify-center items-center text-red-500 text-2xl">
        Barber not found.
      </p>
    );

  return (
    <div className="p-5 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to {barberName} Booking Page
      </h1>
      <ul className="mb-4">
        {services.map((service, index) => {
          return (
            <li key={index} className="mb-1">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={!!selectedServices.find((s) => s === service)}
                  onChange={() => toggleService(service)}
                />
                <span>
                  {service.name} — {service.duration} min — ${service.price}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {/* Next steps: add time slot picker and booking form here */}
    </div>
  );
}
