import { useForm } from "@tanstack/react-form";
import Input from "../Input";
import Button from "../Button";
import { RecordModel } from "pocketbase";
import { useDialogStore } from "@/store/useDialogStore";
import Dialog from "../Dialog";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";
import { auth } from "@/helper/auth";
import todos from "@/helper/todos";
import { useRouterState } from "@tanstack/react-router";
import IconTrash from "../icons/TrashIcon";
import { Bounce, toast } from "react-toastify";

type PropTypes = {
  todo: RecordModel;
};

const DialogEditTodo = ({ todo }: PropTypes) => {
  const invalidateQuery = useInvalidateQueries();
  const { closeDialog } = useDialogStore();

  const router = useRouterState();
  const form = useForm({
    defaultValues: {
      todo: todo.todo,
    },
    onSubmit: async ({ value: updatedTodo }) => {
      const userId = auth.getUserId();
      if (userId) {
        await todos.update.todo(todo.id, updatedTodo.todo);
        if (router.location.pathname === "/") {
          invalidateQuery("todos", userId);
        } else {
          invalidateQuery("calendar-todos");
        }

        closeDialog();
      }
    },
  });

  const handleDeleteTodo = async () => {
    await todos.delete(todo.id);
    invalidateQuery("calendar-todos");
    toast(
      <div className="flex justify-between">
        <span>Event Deleted</span>
        <span onClick={() => handleDeleteUndo()}>Undo</span>
      </div>,
      {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      }
    );
    closeDialog();
  };

  const handleDeleteUndo = async () => {
    const response = await todos.undo(todo);
    console.log(response);
    invalidateQuery("calendar-todos");
  };

  return (
    <Dialog>
      <div className="flex justify-between">
        <h2>Edit Todo</h2>
        <IconTrash
          className="hover:cursor-pointer"
          onClick={handleDeleteTodo}
        />
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}
      >
        <form.Field
          name="todo"
          children={(field) => {
            return (
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            );
          }}
        />
        <Button type="submit">Submit</Button>

        <Button onClick={closeDialog}>Close</Button>
      </form>
    </Dialog>
  );
};

export default DialogEditTodo;
