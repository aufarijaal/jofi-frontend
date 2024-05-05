import { CellContext } from '@tanstack/react-table'
import React from 'react'
import { Icon } from '@iconify-icon/react'

interface Props {
  cellContext: CellContext<any, unknown>
  accessorKey: string
  onDelete: () => Promise<void>
}

const DataTableDeleteAction: React.FC<Props> = ({
  cellContext,
  accessorKey,
  onDelete,
}) => {
  return (
    <button
      className="btn btn-xs btn-error text-white btn-outline"
      disabled={cellContext.row.getIsSelected()}
      onClick={(e) => {
        e.stopPropagation()
        if (
          confirm(
            `Are you sure want to delete ${cellContext.row.getValue(
              accessorKey
            )}?`
          )
        ) {
          onDelete()
        }
      }}
    >
      <Icon icon="mdi:trash-can" />
    </button>
  )
}

export default DataTableDeleteAction
