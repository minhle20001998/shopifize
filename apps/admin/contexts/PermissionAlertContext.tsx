import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from "react";
import { UnAuthorizedAlert } from "~/components/common";

interface PermissionAlertContextType {
  permisisonError: null | string
  setPermissionError: Dispatch<SetStateAction<string | null>>
  clearPermissionError: () => void
}

const PermissionAlertContext = createContext<PermissionAlertContextType>({
  permisisonError: null,
  setPermissionError: () => {},
  clearPermissionError: () => {}
});

function PermissionAlertProvider({ children }: { children: React.ReactNode }) {
  const [permisisonError, setPermissionError] = useState<null | string>(null)

  const clearPermissionError = () => {
    setPermissionError(null)
  }

  const value = useMemo(() => {
    return {
      permisisonError,
      setPermissionError,
      clearPermissionError
    }
  }, [permisisonError])

  return <PermissionAlertContext.Provider
    value={value}
  >
    {permisisonError ? <UnAuthorizedAlert actionText={permisisonError ?? ''} /> : <></>}
    {children}
  </PermissionAlertContext.Provider>
}

export const usePermissionAlert = () => {
  return useContext(PermissionAlertContext);
};

export default PermissionAlertProvider