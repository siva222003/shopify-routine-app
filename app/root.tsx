import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import { ReactNode } from "react";

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <Document title={error.statusText}>
        <section className="w-full h-svh bg-red-100 text-red-600">
          <h1 className="text-3xl">Oops!</h1>
          <p>There was an error:</p>
          <pre>
            {error.status} {error.statusText || error.data}
          </pre>
          <Link to="/app">Go home</Link>
        </section>
      </Document>
    );
  }
  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
  return <h1>Unknown Error</h1>;
}

function Document(props: { children: ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        {props.title ? <title>{props.title}</title> : null}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {props.children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
