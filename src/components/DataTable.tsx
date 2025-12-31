import React from 'react';
import './DataTable.css';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">No data available</div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => {
                const value = row[column.key as keyof T];
                return (
                  <td key={String(column.key)}>
                    {column.render ? column.render(value, row) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

