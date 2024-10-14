// import { TTable } from "@/types/tables.types";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RecordModel } from "pocketbase";
import { auth } from "@/helper/auth";
import todos from "@/helper/todos";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";
import { dateUtils } from "@/helper/utils";
import clsx from "clsx";
import { useDialogStore } from "@/store/useDialogStore";
import DialogEditTodo from "./dialogs/DialogEditTodo";

const columnHelper = createColumnHelper<RecordModel>();

const column = [
  columnHelper.accessor("todo", {
    cell: function TodoCell(info) {
      const invalidateQueries = useInvalidateQueries();
      async function handleTodoComplete(
        todo: RecordModel,
        isComplete: boolean
      ) {
        const userId = auth.getUserId();
        if (userId) {
          await todos.update.completion(todo.id, isComplete);
          invalidateQueries("todos", userId);
        }
      }

      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleTodoComplete(
              info.row.original,
              !info.row.original.is_complete
            );
          }}
          className={clsx(info.row.original.is_complete && "line-through")}
        >
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor("is_complete", {
    cell: (info) => info.cell.getValue().toString(),
  }),
  columnHelper.accessor("date_set", {
    cell: (info) => dateUtils.displayDate(info.getValue()),
  }),
];

type PropTypes = {
  tableData: RecordModel[];
};

const TodoTable = ({ tableData }: PropTypes) => {
  const [data, setData] = useState<RecordModel[]>(() => [...tableData]);

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  });

  const { openDialog } = useDialogStore();

  function handleOpenDialog(todo: RecordModel) {
    openDialog(DialogEditTodo, { todo });
  }

  return (
    <div className="p-2">
      {data.length === 0 ? (
        <div>Nothing to see here...</div>
      ) : (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="w-full">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-300 transition-colors duration-150 hover:cursor-pointer"
                onClick={() => handleOpenDialog(row.original)}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="h-4" />
    </div>
  );
};

export default TodoTable;
