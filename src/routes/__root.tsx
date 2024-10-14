import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import { AuthModel } from "pocketbase";
import Footer from "@/components/Footer";
import { useDialogStore } from "@/store/useDialogStore";

interface IRouterContext {
  user: AuthModel;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
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
