import Router from "next/router";
import { useAuthContext } from "~/contexts/AuthContext";

export const Protected = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { isAuthen, isCheckingAuthen } = useAuthContext();

  if (isAuthen === false && typeof window !== "undefined") {
    void Router.push(`/login?redirect=${Router.asPath}`);
    return <></>;
  }

  if(isCheckingAuthen){
    return <></>
  }

  return children;
};
