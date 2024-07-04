import {
  Row,
  Table as TableType,
} from "@tanstack/react-table";
import { ChangeEvent,  useState } from "react";
import {useDeepCompareEffect} from 'use-deep-compare'

interface UseTableCellSelectionProps<T> {
  data: T[]
  callback?: (rows: T[]) => void
  resetSelectedRows?: (defaultState?: boolean | undefined) => void
}

export const useTableCellSelection = <T,>({ data, callback, resetSelectedRows }: UseTableCellSelectionProps<T>) => {
  const [dataSet, setDataSet] = useState<Set<T>>(new Set()) 
  useDeepCompareEffect(() => {
    setDataSet(new Set())
    resetSelectedRows?.()
  }, [data])

  const handleAllRowSelection = (table: TableType<T>) => (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      // select all
      setDataSet(new Set(data))
      callback?.(data)
    } else {
      // unselect all
      setDataSet(new Set())
      callback?.([])
    }
    table.getToggleAllRowsSelectedHandler()(event)
  }

  const handleRowSelection = (row: Row<T>) => (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const data = row.original as T
    if (checked) {
      // select one
      const newSet = dataSet.add(data)
      setDataSet(newSet)
      callback?.(Array.from(newSet))
    } else {
      // unselect one
      dataSet.delete(data)
      setDataSet(dataSet)
      callback?.(Array.from(dataSet))
    }
    row.getToggleSelectedHandler()(event)
  }

  return {
    dataSet: dataSet,
    setDataSet,
    selectionCount: dataSet.size,
    handleAllRowSelection,
    handleRowSelection
  }
}