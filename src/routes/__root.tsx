import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import { AuthModel } from "pocketbase";
import Footer from "@/components/Footer";

interface IRouterContext {
  user: AuthModel;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <main className="min-h-svh">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});
