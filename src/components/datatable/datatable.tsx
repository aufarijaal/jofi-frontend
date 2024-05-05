import { Icon } from '@iconify-icon/react'
import {
  Cell,
  ColumnDef,
  Table,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

// Layout
// ======== TABLE TOOLBAR ==========
// ======== TABLE SEARCH & FILTER ==========
// ======== TABLE ==========
//   ====== TABLE FOOTER ==========

interface Props {
  data: any
  count: number
  columns: ColumnDef<any, any>[]
  defaultColumnsVisibility?: Record<string, boolean>
  onPaginationChange: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
  onAddBtnClick?: () => void
  onDeleteSelectedClick?: (table: Table<any>) => void
  noAdd?: boolean
  noDeleteMany?: boolean
  noSelection?: boolean
  additionalToolbarButtons?: (table: Table<any>) => React.ReactNode
  onSearch?: (keyword: string, table: Table<any>) => void
  searchPlaceholderText?: string
}

const DataTable: React.FC<Props> = ({
  data,
  columns,
  count,
  defaultColumnsVisibility,
  onPaginationChange,
  onAddBtnClick,
  onDeleteSelectedClick,
  noAdd,
  noDeleteMany,
  noSelection,
  additionalToolbarButtons,
  onSearch,
  searchPlaceholderText,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  })
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(defaultColumnsVisibility ?? {})
  const [rowEditing, setRowEditing] = useState<number[]>(() => [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 500)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(), //not needed for server-side pagination
    manualPagination: true, //turn off client-side pagination
    rowCount: count, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
    // pageCount: dataQuery.data?.pageCount, //alternatively directly pass in pageCount instead of rowCount
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      //...
      pagination,
      rowSelection,
      columnVisibility,
    },
    getRowId: (row) => row.id,
    meta: {
      rowEditing,
      addRowEdit: (id) => {
        if (!rowEditing.includes(id)) {
          setRowEditing((prev) => [...prev, id])
        }
      },
      removeRowEdit: (id) => {
        setRowEditing((prev) =>
          prev.filter((idFromState) => idFromState !== id)
        )
      },
    },
  })

  function renderValue(cell: Cell<any, unknown>) {
    if (typeof cell.getValue() === 'boolean') {
      return cell.getValue() === true ? '✅' : '❌'
    } else if (
      cell.column.id !== 'select-col' &&
      cell.column.id !== 'actions' &&
      (cell.getValue() === null || cell.getValue() === undefined)
    ) {
      return '-'
    } else {
      return flexRender(cell.column.columnDef.cell, cell.getContext())
    }
  }

  useEffect(() => {
    onPaginationChange(pagination)
  }, [pagination])

  useEffect(() => {
    onSearch?.(debouncedGlobalFilter, table)
  }, [debouncedGlobalFilter])

  return (
    <div>
      <div className="table-toolbar flex justify-between my-4 items-center">
        {/* Row selection count label */}
        <div>
          {Object.keys(table.getState().rowSelection).length > 0 && (
            <p className="text-xs">
              <strong>
                {Object.keys(table.getState().rowSelection).length}
              </strong>{' '}
              row(s) selected
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Add new data button */}
          {!noAdd && (
            <button
              className="btn btn-xs btn-success text-white"
              onClick={() =>
                typeof onAddBtnClick === 'function' ? onAddBtnClick() : false
              }
            >
              <Icon icon="mdi:plus" width="20" height="20" />
            </button>
          )}

          {Object.keys(table.getState().rowSelection).length > 0 && (
            <>
              {/* Button for unselect all selected rows */}
              <button
                className="btn btn-xs btn-warning"
                onClick={() => table.toggleAllRowsSelected(false)}
              >
                Unselect all
              </button>

              {/* Button to trigger delete data based on selected rows */}
              {!noDeleteMany && (
                <button
                  className="btn btn-xs btn-error text-white"
                  onClick={() =>
                    typeof onDeleteSelectedClick === 'function'
                      ? onDeleteSelectedClick(table)
                      : false
                  }
                >
                  Delete selected
                </button>
              )}
            </>
          )}

          {/* Additional toolbar buttons defined by user */}
          <div className="additional-toolbar-buttons">
            {/* This function will return react nodes */}
            {typeof additionalToolbarButtons === 'function'
              ? additionalToolbarButtons(table)
              : null}
          </div>
        </div>
      </div>

      <div className="table-search mb-4">
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={searchPlaceholderText ?? 'Type here'}
              className="input input-bordered w-full input-xs"
              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
              value={globalFilter}
            />
            <button
              className="btn btn-xs btn-accent"
              onClick={() => {
                onSearch?.(debouncedGlobalFilter, table)
              }}
            >
              <Icon icon="heroicons:magnifying-glass-20-solid" />
            </button>
          </div>
        </div>
      </div>

      <div className="table-filter mb-4 flex gap-2">
        <div className="dropdown dropdown-hover">
          <button tabIndex={0} role="button" className="btn btn-xs btn-outline">
            Show columns
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col, i) => (
                <li key={i}>
                  <button
                    onClick={() => col.toggleVisibility(!col.getIsVisible())}
                  >
                    <div className="w-[20px] h-[20px]">
                      {col.getIsVisible() ? (
                        <Icon icon="heroicons:check-20-solid" />
                      ) : null}
                    </div>
                    {col.columnDef.header?.toString()}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-xs btn-outline">
            Page size ({pagination.pageSize})
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
          >
            {[10, 30, 50, 100].map((v, i) => (
              <li key={i}>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, pageSize: v }))
                  }
                >
                  {v}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra border border-y border-[var(--fallback-bc,oklch(var(--bc)/0.2))]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="h-10">
                {!noSelection && (
                  <th className="border border-[var(--fallback-bc,oklch(var(--bc)/0.2))] w-10">
                    <input
                      type="checkbox"
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                      className="checkbox checkbox-xs"
                    />
                  </th>
                )}

                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {/* <Icon
                      width="16"
                      height="16"
                      icon="icon-park-outline:sort"
                    />
                    <Icon
                      width="16"
                      height="16"
                      icon="icon-park-solid:sort"
                    /> */}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => (
                <React.Fragment key={i}>
                  <tr
                    key={row.id}
                    className={[
                      'select-none cursor-pointer',
                      row.getIsSelected()
                        ? 'bg-base-300 text-base-content'
                        : 'hover',
                    ]
                      .join(' ')
                      .trim()}
                    onClick={() => {
                      if (!noSelection) row.toggleSelected()
                    }}
                  >
                    {!noSelection && (
                      <td className="border border-[var(--fallback-bc,oklch(var(--bc)/0.2))]">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs"
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          onChange={row.getToggleSelectedHandler()}
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`border border-[var(--fallback-bc,oklch(var(--bc)/0.2))] ${
                          cell.column.columnDef.meta?.className ?? ''
                        } ${cell.getValue() ? '' : 'text-secondary'}`}
                        title={
                          typeof cell.getValue() === 'string'
                            ? (cell.getValue() as string)
                            : ''
                        }
                      >
                        {renderValue(cell)}
                      </td>
                    ))}
                  </tr>
                  {/* {i === 2 && (
                    <tr className="h-max w-full">
                      <td
                        className="border border-[var(--fallback-bc,oklch(var(--bc)/0.2))]"
                        colSpan={columns.length + 1}
                      >
                        <div className="flex items-center gap-2">
                          <div className="-scale-100 rotate-180 flex items-center">
                            <Icon
                              icon="clarity:child-arrow-line"
                              width="16"
                              height="16"
                            />
                          </div>
                          <input
                            type="text"
                            className="input input-xs input-bordered w-full"
                          />
                          <button className="btn btn-xs btn-accent">OK</button>
                        </div>
                      </td>
                    </tr>
                  )} */}
                </React.Fragment>
              ))
            ) : (
              <tr className="h-[300px]">
                <td className="w-full" colSpan={columns.length}>
                  <div className="flex justify-center flex-col gap-6 items-center">
                    <img
                      src="/undraw_void_-3-ggu.svg"
                      alt="no data"
                      className="w-52"
                    />
                    <div className="text-secondary font-bold text-lg">
                      No Data
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="border border-[var(--fallback-bc,oklch(var(--bc)/0.2))]">
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id} className="h-10">
                {!noSelection && <th></th>}
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>

        <div className="mt-6 flex justify-end items-center gap-6 w-full">
          <div>
            <p className="text-xs">
              Page <strong>{pagination.pageIndex + 1}</strong> of{' '}
              <strong>
                {table.getPageCount() === 0 ? 1 : table.getPageCount()}
              </strong>
            </p>
          </div>

          <div className="join">
            <button
              className="join-item btn btn-xs"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-xs"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
