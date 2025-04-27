import { useSuspenseQuery } from "@tanstack/react-query";
import { getGameCoins } from "@/services/game-coins.service";

export const useCoinsData = () => {
  const { data, isLoading, isError, error } = useSuspenseQuery({
    queryKey: ["game-coins"],
    queryFn: getGameCoins,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    gameCoins: data?.gameCoins || [],
    isLoading,
    isError,
    error,
  };
};
