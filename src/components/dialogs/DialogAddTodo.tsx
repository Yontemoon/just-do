import { useForm } from "@tanstack/react-form";
import Dialog from "../Dialog";
import Input from "../Input";
import Button from "../Button";
import { auth } from "@/helper/auth";
import todos from "@/helper/todos";
import { useDialogStore } from "@/store/useDialogStore";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";
import { monthUtils } from "@/helper/utils";

type PropTypes = {
  date: string;
};

const DialogAddTodo = ({ date }: PropTypes) => {
  const { closeDialog } = useDialogStore();
  const invalidateQuery = useInvalidateQueries();
  const form = useForm({
    defaultValues: {
      newTodo: "",
    },
    onSubmit: async ({ value }) => {
      const userId = auth.getUserId();
      if (userId) {
        const response = await todos.create(value.newTodo, date, userId);
        if (response) {
          invalidateQuery("calendar-todos", monthUtils.formatYYYYMM(date));
          closeDialog();
        }
      }
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
          name="newTodo"
          children={(field) => {
            return (
              <Input
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

export default DialogAddTodo;
