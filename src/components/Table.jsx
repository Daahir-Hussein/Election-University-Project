import LoadingSpinner from './LoadingSpinner';

function Table({
  columns = [],
  data = [],
  emptyMessage = 'No records found.',
  isLoading = false,
  rowKey = 'id',
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-200 bg-white">
        <LoadingSpinner label="Loading records..." />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row[rowKey] ?? rowIndex}
                className="transition hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
