import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { useDialogStore } from "@/store/useDialogStore";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { DialogComponent, dialogProps } = useDialogStore();
  return (
    <>
      <Navbar />
      <main className="min-h-svh">
        <Outlet />
        {DialogComponent && <DialogComponent {...dialogProps} />}
      </main>
      <Footer />
    </>
  );
}
