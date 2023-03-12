import { withEmotionCache } from "@emotion/react";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { useContext, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

import ChakraProvider from "@/providers/ChakraProvider";

import { Layout } from "@/layouts";
import { ClientStyleContext, ServerStyleContext } from "@/styles/context";
import {
  CHAKRA_COOKIE_COLOR_KEY,
  DEFAULT_COLOR_MODE,
  getColorMode,
} from "@/styles/theme";

type DocumentProps = {
  children: ReactNode;
  title?: string;
  cookies?: string;
};

export const Document = withEmotionCache(
  ({ children, title, cookies }: DocumentProps, emotionCache) => {
    const serverStyles = useContext(ServerStyleContext);
    const clientStyles = useContext(ClientStyleContext);
    const cookiesRef = useRef<string>(cookies || "");

    // the client get the cookies from the document
    // because when we do a client routing, the loader can have stored an outdated value
    if (typeof document !== "undefined") {
      cookiesRef.current = document.cookie;
    }

    const colorMode = useMemo(() => {
      let color = getColorMode(cookiesRef.current);

      if (!color && DEFAULT_COLOR_MODE) {
        cookiesRef.current += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`;
        color = DEFAULT_COLOR_MODE;
      }

      return color;
    }, []);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyles?.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html
        lang="en"
        {...(colorMode && {
          "data-theme": colorMode,
          style: { colorScheme: colorMode },
        })}
      >
        <head>
          {title && <title>{title}</title>}
          <Meta />
          <Links />
          {serverStyles?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body
          {...(colorMode && {
            className: `chakra-ui-${colorMode}`,
          })}
        >
          <ChakraProvider cookies={cookiesRef.current}>
            <Layout>{children}</Layout>
          </ChakraProvider>
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
          <Analytics />
        </body>
      </html>
    );
  }
);

export default Document;
