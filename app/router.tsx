// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Error from "./components/Error";
import { QueryClient } from "@tanstack/react-query";

export function createRouter() {
  const queryClient = new QueryClient();
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: Error,
    defaultNotFoundComponent: Error,
    context: { queryClient },
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
