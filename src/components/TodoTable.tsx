// import { TTable } from "@/types/tables.types";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
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
import Button from "./Button";
import DialogConfirmDeleteTodo from "./dialogs/DialogConfirmDeleteTodo";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columnHelper = createColumnHelper<RecordModel>();

// Cell Component
const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button
      {...attributes}
      {...listeners}
      className="z-50 hover:cursor-grab active:cursor-grabbing w-full h-full hover:border"
    >
      🟰
    </button>
  );
};

const DraggableRow = ({ row }: { row: Row<RecordModel> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  const { openDialog } = useDialogStore();

  function handleOpenDialog(todo: RecordModel) {
    openDialog(DialogEditTodo, { todo });
  }

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  return (
    // connect row ref to dnd-kit, apply important styles
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-200 hover:cursor-pointer z-0"
      onClick={() => handleOpenDialog(row.original)}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const column = [
  columnHelper.accessor("drag-handle", {
    cell: (info) => <RowDragHandleCell rowId={info.row.original.id} />,
    size: 60,
    header: "Move",
    enableSorting: false,
  }),
  columnHelper.accessor("todo", {
    enableSorting: true,
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
    enableSorting: true,
    cell: (info) => <span>{info.cell.getValue().toString()}</span>,
  }),
  columnHelper.accessor("date_set", {
    cell: (info) => <span>{dateUtils.displayDate(info.getValue())}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("delete_action", {
    cell: function CellDelete(info) {
      const { openDialog } = useDialogStore();
      return (
        <Button
          className="z-50"
          onClick={(e) => {
            e.stopPropagation();
            openDialog(DialogConfirmDeleteTodo, {
              todoId: info.row.original.id,
            });
          }}
        >
          Delete
        </Button>
      );
    },
    enableSorting: false,
  }),
];

type PropTypes = {
  tableData: RecordModel[];
};

const TodoTable = ({ tableData }: PropTypes) => {
  const [data, setData] = useState<RecordModel[]>(() => [...tableData]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const dataIds = useMemo<UniqueIdentifier[]>(() => {
    return data?.map(({ id }) => id);
  }, [data]);

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <>
      {data.length === 0 ? (
        <span>Nothing to see here...</span>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="w-full">
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      )}
      <div className="h-4" />
    </>
  );
};

export default TodoTable;
