import { isNil } from "@shopifize/helpers";
import { useProfileQuery } from "queries/useProfileQuery";
import { createContext, useContext, useEffect, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { authPubSubInstance } from "~/hooks/useShopifizedQuery";

interface AuthContextType {
  isAuthen: boolean;
  isCheckingAuthen: boolean;
  setIsFailRefreshToken?: (isFail: boolean) => void;
  isProfileEmpty?: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthen: false,
  isCheckingAuthen: false,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfileQuery();
  const [isFailRefreshToken, setIsFailRefreshToken] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    authPubSubInstance.subscribe(setIsFailRefreshToken);
    return () => {
      authPubSubInstance.unsubscribe(setIsFailRefreshToken);
    };
  }, []);

  const isAuthen = useDeepCompareMemo(() => {
    if (isFailRefreshToken === true) {
      return false;
    }
    return !isNil(profile) || !isFailRefreshToken;
  }, [isFailRefreshToken, profile]);

  const isCheckingAuthen = profile === undefined;

  const isProfileEmpty = () => {
    const clonedProfile = profile ? { ...profile } : null;
    if (!profile) {
      return true;
    }
    // not count email as profile detail
    if (clonedProfile?.email) {
      return Object.keys(profile).length === 1;
    }
    return Object.keys(profile).length === 0;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthen,
        isCheckingAuthen,
        isProfileEmpty,
        setIsFailRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
