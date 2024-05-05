import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    editState?: {
      set: (value: boolean) => void
      get: () => boolean
    }
  }

  interface TableMeta<TData extends RowData> {
    rowEditing: number[]
    addRowEdit: (id: number) => void
    removeRowEdit: (id: number) => void
  }
}
