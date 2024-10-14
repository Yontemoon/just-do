import Button from "../Button";
import Dialog from "../Dialog";
import { useDialogStore } from "@/store/useDialogStore";
import { authAction } from "@/helper/auth";
import { useNavigate } from "@tanstack/react-router";

const DialogConfirmLogout = () => {
  const { closeDialog } = useDialogStore();
  const navigate = useNavigate();

  return (
    <Dialog>
      <h2>Are You sure you want to logout?</h2>
      <Button
        onClick={() => {
          authAction.logout();
          navigate({
            to: "/signin",
          });
          closeDialog();
        }}
      >
        Logout
      </Button>
      <Button onClick={closeDialog}>Cancel</Button>
    </Dialog>
  );
};

export default DialogConfirmLogout;
