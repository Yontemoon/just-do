import { useForm } from "@tanstack/react-form";
import Input from "../Input";
import Button from "../Button";
import { pb } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";
import { useQueryClient } from "@tanstack/react-query";
import { useDialogStore } from "@/store/useDialogStore";
import Dialog from "../Dialog";

type PropTypes = {
  todo: RecordModel;
};

const DialogEditTodo = ({ todo }: PropTypes) => {
  const queryClient = useQueryClient();
  const { closeDialog } = useDialogStore();
  const form = useForm({
    defaultValues: {
      todo: todo.todo,
    },
    onSubmit: async ({ value: updatedTodo }) => {
      await pb.collection("todos").update(todo.id, { todo: updatedTodo.todo });
      queryClient.invalidateQueries({ queryKey: ["todos", todo.user] });
      closeDialog();
    },
  });

  return (
    <Dialog>
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
