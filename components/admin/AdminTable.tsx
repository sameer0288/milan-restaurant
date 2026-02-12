"use client";

import { Trash2 } from "lucide-react";

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onDelete?: (item: T) => void;
    onEdit?: (item: T) => void;
}

export function AdminTable<T extends { id: string }>({
    data,
    columns,
    onDelete,
    onEdit,
}: AdminTableProps<T>) {
    return (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted text-muted-foreground border-b border-border">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key as string}
                                    className="px-6 py-4 text-left text-sm font-semibold"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(onDelete || onEdit) && (
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onDelete || onEdit ? 1 : 0)}
                                    className="px-6 py-8 text-center text-muted-foreground"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key as string}
                                            className="px-6 py-4 text-sm text-foreground"
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : String(item[column.key as keyof T] || "")}
                                        </td>
                                    ))}
                                    {(onDelete || onEdit) && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
