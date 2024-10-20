import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { useDialogStore } from "@/store/useDialogStore";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    </>
  );
}
