import { useForm } from "@tanstack/react-form";
import Input from "../Input";
import Button from "../Button";
import { RecordModel } from "pocketbase";
import { useDialogStore } from "@/store/useDialogStore";
import Dialog from "../Dialog";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";
import { auth } from "@/helper/auth";
import todos from "@/helper/todos";
type PropTypes = {
  todo: RecordModel;
};

const DialogEditTodo = ({ todo }: PropTypes) => {
  const invalidateQuery = useInvalidateQueries();
  const { closeDialog } = useDialogStore();
  const form = useForm({
    defaultValues: {
      todo: todo.todo,
    },
    onSubmit: async ({ value: updatedTodo }) => {
      const userId = auth.getUserId();
      if (userId) {
        await todos.update.todo(todo.id, updatedTodo.todo);
        invalidateQuery("todos", userId);
        closeDialog();
      }
    },
  });

  return (
    <Dialog>
      <h2>Edit Todo</h2>
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
