import { useQuery } from "@tanstack/react-query";
import { getShopBySlug } from "@/app/api/getShopBySlug";

export const useShopBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["shop", slug],
    queryFn: () => getShopBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
