export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BarberPage({ params }: Props) {
  const awaitedParams = await params;
  const q = query(
    collection(db, "barbers"),
    where("slug", "==", awaitedParams.slug)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return <div>Barber not found.</div>;
  }

  const barber = querySnapshot.docs[0].data();
  console.log(barber);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Welcome to {barber.barberName} Booking Page
      </h1>
    </div>
  );
}
