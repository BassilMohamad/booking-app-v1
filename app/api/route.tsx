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
    console.log(ip);

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

    // 1. Limit by IP (check existing bookings in the array)
    const recentBookings = (shopData.bookings || []).filter(
      (b: any) =>
        b.ip === ip && b.createdAt?.toMillis() > Date.now() - 60 * 60 * 1000 // last 1 hour
    );

    if (recentBookings.length >= 4) {
      return NextResponse.json(
        { error: "Booking limit reached (max 5 per hour)" },
        { status: 429 }
      );
    }

    // 2. Prevent double-booking (check existing bookings in array)
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

    // 3. Add booking to the array
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
