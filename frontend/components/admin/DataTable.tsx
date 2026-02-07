import React from 'react';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Column<T> {
    header: string;
    accessorKey: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onDelete?: (item: T) => void;
    editPath?: (item: T) => string;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onDelete,
    editPath
}: DataTableProps<T>) {
    return (
        <div className="bg-ms-white border border-ms-fog overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-ms-ivory border-b border-ms-fog">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={cn("p-4 font-medium text-xs text-ms-stone uppercase tracking-wider", col.className)}
                            >
                                {col.header}
                            </th>
                        ))}
                        {(onDelete || editPath) && <th className="p-4 w-20"></th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-ms-fog">
                    {data.map((item, rowIdx) => (
                        <tr key={item.id} className="hover:bg-ms-ivory/50 transition-colors">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="p-4 text-sm text-ms-black">
                                    {typeof col.accessorKey === 'function'
                                        ? col.accessorKey(item)
                                        : (item[col.accessorKey] as React.ReactNode)}
                                </td>
                            ))}
                            {(onDelete || editPath) && (
                                <td className="p-4 flex justify-end gap-2">
                                    {editPath && (
                                        <Link href={editPath(item)}>
                                            <Button variant="text" size="sm" className="p-2 h-8 w-8">
                                                <Edit className="w-4 h-4 text-ms-stone hover:text-ms-black" />
                                            </Button>
                                        </Link>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="text"
                                            size="sm"
                                            className="p-2 h-8 w-8"
                                            onClick={() => onDelete(item)}
                                        >
                                            <Trash2 className="w-4 h-4 text-ms-error hover:text-red-700" />
                                        </Button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + (onDelete || editPath ? 1 : 0)} className="p-8 text-center text-ms-stone">
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
