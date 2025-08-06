import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SignInData {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation<UserCredential, Error, SignInData>({
    mutationFn: async ({ email, password }) => {
      return await signInWithEmailAndPassword(auth, email, password);
    },
    mutationKey: ["sign-in"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", data.user.uid] });
    },
  });
};
