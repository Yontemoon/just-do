import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <Navbar />
      <Outlet />
    </React.Fragment>
  ),
});
