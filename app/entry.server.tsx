import { renderToString } from "react-dom/server";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/server-runtime";
import handleVercelRemixRequest from "@vercel/remix-entry-server";
import { ServerStyleContext } from "./styles/context";
import { createEmotionCache } from "./styles/createEmotionCache";

export default function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const emotionCache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(emotionCache);

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={emotionCache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  const chunks = extractCriticalToChunks(html);

  const remixServer = (
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={emotionCache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  return handleVercelRemixRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer
  );
}

// import { PassThrough } from "stream";
// import type { EntryContext } from "@remix-run/node";
// import { Response } from "@remix-run/node";
// import { RemixServer } from "@remix-run/react";
// import isbot from "isbot";
// import { renderToPipeableStream } from "react-dom/server";
// import { CacheProvider } from "@emotion/react";
// import createEmotionServer from "@emotion/server/create-instance";

// import { createEmotionCache } from "@/styles/createEmotionCache";
// import { ServerStyleContext } from "./styles/context";

// const ABORT_DELAY = 5000;

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext
// ) {
//   const callbackName = isbot(request.headers.get("user-agent"))
//     ? "onAllReady"
//     : "onShellReady";

//   return new Promise((resolve, reject) => {
//     let didError = false;
//     const emotionCache = createEmotionCache();

//     const { pipe, abort } = renderToPipeableStream(
//       <CacheProvider value={emotionCache}>
//         <RemixServer context={remixContext} url={request.url} />
//       </CacheProvider>,
//       {
//         [callbackName]: () => {
//           const reactBody = new PassThrough();
//           const emotionServer = createEmotionServer(emotionCache);

//           const bodyWithStyles = emotionServer.renderStylesToNodeStream();
//           reactBody.pipe(bodyWithStyles);

//           responseHeaders.set("Content-Type", "text/html");

//           resolve(
//             new Response(bodyWithStyles, {
//               headers: responseHeaders,
//               status: didError ? 500 : responseStatusCode,
//             })
//           );

//           pipe(reactBody);
//         },
//         onShellError: (error: unknown) => {
//           reject(error);
//         },
//         onError: (error: unknown) => {
//           didError = true;

//           console.error(error);
//         },
//       }
//     );

//     setTimeout(abort, ABORT_DELAY);
//   });
// }
