import { CellContext } from '@tanstack/react-table'
import React from 'react'
import { Icon } from '@iconify-icon/react'

interface Props {
  cellContext: CellContext<any, unknown>
  onClick: () => void
  disabled?: boolean
}

const DataTableEditAction: React.FC<Props> = ({
  cellContext,
  onClick,
  disabled,
}) => {
  return (
    <button
      className="btn btn-xs btn-success text-white btn-outline"
      disabled={cellContext.row.getIsSelected() || disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <Icon icon="mdi:pencil" />
    </button>
  )
}

export default DataTableEditAction
