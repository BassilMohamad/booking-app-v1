"use client";

import { useEffect, useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useBarberSlug } from "@/hooks/useBarberSlug";
import Link from "next/link";

export default function UpdateBarberNameForm() {
  const { user, loading: authLoading } = useAuth();
  const [barberName, setBarberName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const slug = useBarberSlug();

  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [serviceDuration, setServiceDuration] = useState<number>(0);

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const barberRef = doc(db, "barbers", user.uid);
      await updateDoc(barberRef, {
        barberName: barberName,
      });
      setMessage("Barber name updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Error updating barber name.");
    } finally {
      setLoading(false);
    }
  };
  const handleAdd = async () => {
    const newService = {
      id: serviceName.toLowerCase().replace(/\s+/g, "-"),
      name: serviceName,
      price: servicePrice,
      duration: serviceDuration,
    };

    const barberRef = doc(db, "barbers", user!.uid);
    await updateDoc(barberRef, {
      servicesWithPriceAndTime: arrayUnion(newService),
    });

    setServiceName("");
    setServicePrice(0);
    setServiceDuration(0);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        className="border p-2 rounded w-full mb-2"
        placeholder="Enter new barber name"
        value={barberName}
        onChange={(e) => setBarberName(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        {loading ? "Updating..." : "Update Barber Name"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}

      <h1>
        <Link target="_blank" href={`http://localhost:3000/barber/${slug}`}>
          Your Website
        </Link>
      </h1>

      <div className="space-y-2">
        <input
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service name"
        />
        <input
          type="number"
          value={servicePrice}
          onChange={(e) => setServicePrice(Number(e.target.value))}
          placeholder="Price"
        />
        <input
          type="number"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(Number(e.target.value))}
          placeholder="Duration (min)"
        />
        <button onClick={handleAdd}>Add Service</button>
      </div>
    </div>
  );
}
