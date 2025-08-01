"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithBarber } from "@/lib/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [barberName, setBarberName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      await signUpWithBarber(email, password, barberName);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Barber Name"
          value={barberName}
          onChange={(e) => setBarberName(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-3 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
