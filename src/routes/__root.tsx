import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { useDialogStore } from "@/store/useDialogStore";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    loader: Loader,
    errorComponent: Error,
    notFoundComponent: Error,
  }
);

function RootComponent() {
  const { DialogComponent, dialogProps } = useDialogStore();
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
        {DialogComponent && <DialogComponent {...dialogProps} />}
      </main>
      <Footer />
    </>
  );
}
