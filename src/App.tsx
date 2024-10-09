import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PocketProvider } from "@/context/AuthContext";
import { usePocket } from "@/hooks/useAuth";
import { router } from "@/router";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const { user } = usePocket();
  return <RouterProvider router={router} context={{ user }} />;
}

function App() {
  const queryClient = new QueryClient();

  return (
    <PocketProvider>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </PocketProvider>
  );
}

export default App;
