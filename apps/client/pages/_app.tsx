import "../styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
import { NextPage } from "next";
import { ErrorBoundary } from "~/components/pages/error";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import AuthProvider from "~/contexts/AuthContext";
import { ThemeProvider } from "@shopifize/ui";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 0 } } })
  );

  return (
    <main>
      <ErrorBoundary>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              autoHideDuration={2500}
            >
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  {getLayout(<Component {...pageProps} />)}
                </AuthProvider>
              </QueryClientProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </main>
  );
}

export default App;
