import { Link, useLocation } from "@tanstack/react-router";
import Button from "./Button";
import useUser from "../hooks/useUser";
import { dateUtils, monthUtils } from "@/helper/utils";
import { useDialogStore } from "@/store/useDialogStore";
import DialogConfirmLogout from "./dialogs/DialogConfirmLogout";
import clsx from "clsx";

const Navbar = () => {
  const user = useUser();
  const { openDialog } = useDialogStore();
  const location = useLocation();

  return (
    <nav className="flex justify-between">
      <Link
        to="/"
        search={{
          display: "all",
          date: dateUtils.getToday(),
          date_all: false,
        }}
        className={clsx(location.pathname === "/" && "font-bold")}
      >
        <div>Home</div>
      </Link>
      <Link
        to="/calendar/$date"
        className={clsx(location.pathname.includes("/calendar") && "font-bold")}
        params={{ date: monthUtils.today() }}
      >
        <div>Calendar</div>
      </Link>
      <Link to="/stats" className="[&.active]:font-bold">
        <div>Stats</div>
      </Link>

      {user ? (
        <>
          <div>{user}</div>
          <div>
            <Button
              onClick={() => {
                openDialog(DialogConfirmLogout);
              }}
            >
              Sign Out
            </Button>
          </div>
        </>
      ) : (
        <Link to="/signin">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
