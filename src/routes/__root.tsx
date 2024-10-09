import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import { AuthModel } from "pocketbase";

interface IRouterContext {
  user: AuthModel;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
});
