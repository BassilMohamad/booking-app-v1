import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shopSlug, booking, clientId } = body;

    if (!shopSlug || !booking || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const shopRef = doc(db, "shops", shopSlug);
    const shopSnap = await getDoc(shopRef);
    if (!shopSnap.exists()) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const shopData = shopSnap.data();

    const now = Timestamp.now().toDate();
    const currentHour = now.getHours();
    const currentDate = now.toISOString().split("T")[0];

    // Limit per clientId per hour
    const bookingsThisHour = (shopData.bookings || []).filter((b: any) => {
      if (b.clientId !== clientId || !b.createdAt) return false;
      const created =
        b.createdAt instanceof Timestamp
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
      return (
        created.toISOString().split("T")[0] === currentDate &&
        created.getHours() === currentHour
      );
    });

    if (bookingsThisHour.length >= 5) {
      return NextResponse.json(
        { error: "Booking limit reached (max 5 per hour)" },
        { status: 429 }
      );
    }

    // Prevent double-booking
    const doubleBooked = (shopData.bookings || []).some(
      (b: any) =>
        b.barberId === booking.barberId &&
        b.date === booking.date &&
        b.time === booking.time
    );
    if (doubleBooked) {
      return NextResponse.json(
        { error: "Time slot already booked" },
        { status: 400 }
      );
    }

    // Add booking
    await updateDoc(shopRef, {
      bookings: arrayUnion({
        ...booking,
        clientId,
        createdAt: Timestamp.now(),
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
