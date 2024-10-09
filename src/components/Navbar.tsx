import { Link } from "@tanstack/react-router";
import { pb } from "../lib/pocketbase";
import { useState } from "react";
import { usePocket } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = usePocket();

  return (
    <nav className="flex justify-between">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      {user ? (
        <>
          <div>{user?.username}</div>
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <Link to="/signin">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
