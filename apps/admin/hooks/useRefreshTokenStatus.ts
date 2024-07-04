import { useEffect, useState } from "react";
import { authPubSubInstance } from "./useShopifizedQuery";

export const useRefreshTokenStatus = () => {
  const [isFailRefreshToken, setIsFailRefreshToken] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    authPubSubInstance.subscribe(setIsFailRefreshToken);
    return () => {
      authPubSubInstance.unsubscribe(setIsFailRefreshToken);
    };
  }, []);

  return { isFailRefreshToken }
}