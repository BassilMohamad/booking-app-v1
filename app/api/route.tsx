import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

// Get client IP
function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    console.log("Client IP:", ip);

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { shopSlug, booking } = body;
    if (!shopSlug || !booking) {
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

    // 1. Limit by IP per hour
    const ipBookingsThisHour = (shopData.bookings || []).filter((b: any) => {
      if (b.ip !== ip) return false;

      // booking.date = "YYYY-MM-DD", booking.time = "HH:mm"
      const [newHour] = booking.time.split(":");
      const [existingHour] = b.time.split(":");

      return b.date === booking.date && existingHour === newHour;
    });

    if (ipBookingsThisHour.length >= 5) {
      return NextResponse.json(
        { error: "Booking limit reached (max 5 per hour for your IP)" },
        { status: 429 }
      );
    }

    // 2. Prevent double-booking
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

    // 3. Add booking
    await updateDoc(shopRef, {
      bookings: arrayUnion({
        ...booking,
        ip,
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
