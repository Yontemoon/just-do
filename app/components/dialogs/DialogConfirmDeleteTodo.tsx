import { useDialogStore } from "@/store/useDialogStore";
import Dialog from "../Dialog";
import Button from "../Button";
import { pb } from "@/lib/pocketbase";
import { auth } from "@/helper/auth";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";

type PropTypes = {
  todoId: string;
};

const DialogConfirmDeleteTodo = ({ todoId }: PropTypes) => {
  const { closeDialog } = useDialogStore();

  const invalidateQuery = useInvalidateQueries();

  return (
    <Dialog>
      <h2>Are you sure??</h2>
      <div className="flex justify-between">
        <Button
          onClick={async () => {
            const userId = auth.getUserId();
            if (userId) {
              await pb.collection("todos").delete(todoId);
              invalidateQuery("todos", userId);
              closeDialog();
            }
          }}
        >
          Confirm
        </Button>
        <Button onClick={closeDialog}>Close</Button>
      </div>
    </Dialog>
  );
};

export default DialogConfirmDeleteTodo;
