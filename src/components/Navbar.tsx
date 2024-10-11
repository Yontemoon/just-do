import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { auth, authAction } from "@/helper/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = auth.getUserInfo();
  return (
    <nav className="flex justify-between">
      <ul>
        <li>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
        </li>
      </ul>

      {userInfo ? (
        <>
          <li>{userInfo.user}</li>
          <li
            onClick={() => {
              authAction.logout();
              navigate({ to: "/signin" });
            }}
          >
            Sign Out
          </li>
        </>
      ) : (
        <Link to="/signin">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
