import { dateUtils } from "@/helper/utils";
import Button from "./Button";
import { Link } from "@tanstack/react-router";

const Error = () => {
  return (
    <div>
      <h3>An Error Ocurred...</h3>
      <Link
        to="/"
        search={{
          date: dateUtils.getToday(),
          date_all: false,
          display: "all",
        }}
      >
        <Button>Home Page</Button>
      </Link>
    </div>
  );
};

export default Error;
