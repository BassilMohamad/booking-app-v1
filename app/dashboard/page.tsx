"use client";

import { useAuth } from "@/hooks/useAuth";
import { logOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await logOut();
    router.push("/");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!user) return null;

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h5>This is the dashboard!!!</h5>
      <button
        onClick={handleLogout}
        className="p-2 border border-amber-500 bg-amber-400 text-white rounded hover:bg-amber-500 transition">
        Log Out
      </button>
    </div>
  );
}
