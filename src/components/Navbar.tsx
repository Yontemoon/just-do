import { Link } from "@tanstack/react-router";
import { usePocket } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

const Navbar = () => {
  const { user, logout } = usePocket();
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between">
      <ul>
        <li>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
        </li>
      </ul>

      {user ? (
        <>
          <li>{user?.username}</li>
          <li
            onClick={() => {
              logout();
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
