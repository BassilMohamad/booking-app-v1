"use client";
import { signIn } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Authenticate user
      const loggedInUser = await signIn(email, password);
      const uid = loggedInUser.user.uid;

      // Fetch shop with this ownerId
      const shopsRef = collection(db, "shops");
      const q = query(shopsRef, where("ownerId", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No shop found for this user.");
      }

      // Assume first shop if multiple
      const shopData = querySnapshot.docs[0].data();
      const slug = shopData.slug;

      if (!slug) {
        throw new Error("Shop does not have a slug.");
      }

      // Redirect to dashboard
      router.push(`/barber/${slug}/dashboard`);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials or shop setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
