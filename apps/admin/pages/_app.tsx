import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import { NextPage } from 'next';
import { ReactElement, ReactNode, useState } from 'react';
import { Roboto } from "@next/font/google";
import { ThemeProvider } from '@shopifize/ui';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from '~/contexts/AuthContext';

export const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
});


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

  return <main className={roboto.className}>
    <ThemeProvider>
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

    </ThemeProvider>
  </main>
}

export default App
