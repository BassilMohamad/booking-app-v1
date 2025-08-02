"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

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
    </div>
  );
}
