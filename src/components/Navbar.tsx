import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { authAction } from "@/helper/auth";
import Button from "./Button";

import useUser from "@/hooks/useUser";
import { dateUtils } from "@/helper/utils";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useUser();

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
            className="[&.active]:font-bold"
          >
            Home
          </Link>{" "}
        </li>

        {user ? (
          <>
            <li>{user}</li>
            <li>
              <Button
                onClick={() => {
                  authAction.logout();
                  navigate({ to: "/signin" });
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
