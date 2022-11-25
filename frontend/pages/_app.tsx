import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Layout from "@/components/layout";
import createEmotionCache from "@/utils/create-emotion-cache";
import theme from "@/utils/theme";
import "../styles/globals.css";

if (process.env.NEXT_PUBLIC_MOCKING === "true") {
  require("../mocks");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session: Session;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    session,
  } = props;
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {domLoaded && (
            <Layout>
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            </Layout>
          )}
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
