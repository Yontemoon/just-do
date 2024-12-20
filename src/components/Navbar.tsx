import { Link, useLocation } from "@tanstack/react-router";
import Button from "./Button";
import useUser from "@/hooks/useUser";
import { dateUtils, monthUtils } from "@/helper/utils";
import { useDialogStore } from "@/store/useDialogStore";
import DialogConfirmLogout from "./dialogs/DialogConfirmLogout";
import clsx from "clsx";

const Navbar = () => {
  const user = useUser();
  const { openDialog } = useDialogStore();
  const location = useLocation();

  return (
    <nav>
      <ul className="flex justify-between">
        <li>
          <Link
            to="/"
            search={{
              display: "all",
              date: dateUtils.getToday(),
              date_all: false,
            }}
            className={clsx(location.pathname === "/" && "font-bold")}
          >
            Home
          </Link>
          <Link
            to="/calendar/$date"
            className={clsx(
              location.pathname.includes("/calendar") && "font-bold"
            )}
            params={{ date: monthUtils.today() }}
          >
            Calendar
          </Link>
          <Link to="/stats" className="[&.active]:font-bold">
            Stats
          </Link>
        </li>

        {user ? (
          <>
            <li>{user}</li>
            <li>
              <Button
                onClick={() => {
                  openDialog(DialogConfirmLogout);
                }}
              >
                Sign Out
              </Button>
            </li>
          </>
        ) : (
          <Link to="/signin">Login</Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
