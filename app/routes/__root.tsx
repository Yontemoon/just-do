import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { useDialogStore } from "@/store/useDialogStore";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Meta, Scripts } from "@tanstack/start";
import React from "react";
import styles from "@/index.css?url";

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "Just Do",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap",
        },
        {
          rel: "stylesheet",
          href: styles,
        },
      ],
    }),
    component: RootComponent,
    loader: Loader,
    errorComponent: Error,
    notFoundComponent: Error,
  }
);

function RootComponent() {
  const { DialogComponent, dialogProps } = useDialogStore();
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <main>
          <Outlet />
          {DialogComponent && <DialogComponent {...dialogProps} />}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </main>
        <Footer />
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        <React.Suspense>{children}</React.Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
