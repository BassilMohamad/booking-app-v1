import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await signOut(auth);
    },
    mutationKey: ["log-out"],
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
