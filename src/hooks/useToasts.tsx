import todos from "@/helper/todos";
import { RecordModel } from "pocketbase";
import { Bounce, toast } from "react-toastify";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";
import { useRouterState } from "@tanstack/react-router";
import { auth } from "@/helper/auth";

const useDeleteToast = () => {
  const invalidateQuery = useInvalidateQueries();
  const router = useRouterState();

  const handleDeleteUndo = async (todo: RecordModel) => {
    const userId = auth.getUserId() as string;
    await todos.undo(todo);
    const pathname = router.location.pathname;
    if (pathname === "/") {
      invalidateQuery("todos", userId);
    } else if (pathname === "/calendar") {
      invalidateQuery("calendar-todos");
    }
  };

  const showDeleteToast = (todo: RecordModel) => {
    toast(
      <div className="flex justify-between">
        <span>Event Deleted</span>
        <button
          className="text-blue-500 underline"
          onClick={() => handleDeleteUndo(todo)}
        >
          Undo
        </button>
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
  };

  return showDeleteToast;
};

export { useDeleteToast };
