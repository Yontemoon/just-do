import { useDialogStore } from "@/store/useDialogStore";
import Dialog from "../Dialog";
import Button from "../Button";
import { pb } from "@/lib/pocketbase";
import { useQueryClient } from "@tanstack/react-query";
import { getUserId } from "@/helper/auth";

type PropTypes = {
  todoId: string;
};

const DialogConfirmDeleteTodo = ({ todoId }: PropTypes) => {
  const { closeDialog } = useDialogStore();
  const queryClient = useQueryClient();

  return (
    <Dialog>
      <h2>Are you sure??</h2>
      <Button
        onClick={async () => {
          const userId = getUserId();
          await pb.collection("todos").delete(todoId);
          queryClient.invalidateQueries({ queryKey: ["todos", userId] });
          closeDialog();
        }}
      >
        Confirm
      </Button>
      <Button onClick={closeDialog}>Close</Button>
    </Dialog>
  );
};

export default DialogConfirmDeleteTodo;
