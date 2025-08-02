"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
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
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
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
    </div>
  );
}
