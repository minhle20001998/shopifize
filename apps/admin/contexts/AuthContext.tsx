import { isNil } from "@shopifize/helpers";
import { useProfileQuery } from "~/queries";
import { createContext, useContext } from "react";
import { useRefreshTokenStatus } from "~/hooks/useRefreshTokenStatus";

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
  // const [isFailRefreshToken, setIsFailRefreshToken] = useState<
  //   boolean | undefined
  // >(undefined);

  // useEffect(() => {
  //   authPubSubInstance.subscribe(setIsFailRefreshToken);
  //   return () => {
  //     authPubSubInstance.unsubscribe(setIsFailRefreshToken);
  //   };
  // }, []);
  const {isFailRefreshToken} = useRefreshTokenStatus()

  const isAuthen =
    !isNil(profile) ?? isFailRefreshToken === undefined
      ? true
      : !isFailRefreshToken;

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
