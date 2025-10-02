"use client";

import * as React from "react";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RecordForm from "@/components/record-form";
import { toast } from "sonner";

export type Record = {
  _id: string;
  photoUrl: string;
  country: string;
  contactNumber: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accountType: string;
};

const getColumns = (
  handleEdit: (record: Record) => void,
  handleDelete: (id: string) => void
): ColumnDef<Record>[] => [
  {
    accessorKey: "photoUrl",
    header: "Photo",
    cell: ({ getValue }) => (
      <img src={getValue() as string} className=" size-20" />
    ),
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row, getValue }) =>
      getValue<string>() + " " + row.original.lastName,
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "accountType",
    header: "Account Type",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(record)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(record._id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable({
  data,
  onRefetch,
}: {
  data: Record[];
  onRefetch: () => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<Record | undefined>(
    undefined
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        const res = await fetch(`/api/record/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          onRefetch();
          toast.success("Record deleted successfully");
        } else {
          toast.error("Failed to delete record");
        }
      } catch (error) {
        toast.error("Error deleting record");
      }
    }
  };

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
    setOpen(true);
  };

  const columns = getColumns(handleEdit, handleDelete);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) setEditingRecord(undefined);
          }}
        >
          <DialogTrigger asChild>
            <Button className="ml-auto cursor-pointer">
              <Plus /> Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Edit Record" : "Add New Record"}
              </DialogTitle>
            </DialogHeader>
            <RecordForm
              record={editingRecord}
              onSuccess={() => {
                onRefetch();
                setOpen(false);
                setEditingRecord(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
