"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function BarberLivePage({ slug }: { slug: string }) {
  const [barberName, setBarberName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "barbers"), where("slug", "==", slug));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const barber = snapshot.docs[0].data();
        setBarberName(barber.barberName);
      } else {
        setBarberName(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (barberName === null) return <p>Barber not found.</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Welcome to {barberName} Booking Page
      </h1>
    </div>
  );
}
