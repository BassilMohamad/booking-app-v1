"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSignIn } from "@/app/api/auth/sign-in";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { mutate: signInMutate, error, isPending } = useSignIn();

  const handleLogin = () => {
    signInMutate(
      { email, password },
      {
        onSuccess: async (loggedInUser) => {
          const uid = loggedInUser.user.uid;

          const shopsRef = collection(db, "shops");
          const q = query(shopsRef, where("ownerId", "==", uid));
          const querySnapshot = await getDocs(q);

          const shopData = querySnapshot.docs[0].data();
          const slug = shopData.slug;

          router.push(`/barber/${slug}/dashboard`);
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
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
        {error && <p className="text-red-500 text-sm mb-3">{error.message}</p>}
        <button
          onClick={handleLogin}
          disabled={isPending}
          className={`w-full p-2 rounded text-white ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {isPending ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
