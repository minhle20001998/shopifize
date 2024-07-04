/* eslint-disable react-hooks/exhaustive-deps */
import { SelectChangeEvent } from "@mui/material"
import { PaginationResponseType } from "@shopifize/helpers"
import { Table } from "@tanstack/react-table"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useMemo, useState } from "react"

export const useTablePagination = <T,>(pagination?: PaginationResponseType, table?: Table<T>) => {
  const router = useRouter()
  const query = router.query
  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(query?.skip?.toString())
    return isNaN(page) ? 1 : page
  });

  useEffect(() => {
    table?.setPageSize(pagination?.limit ?? 10)
  }, [])

  useEffect(() => {
    setCurrentPage(Number(query?.skip?.toString()) + 1 || 1)
  }, [query])

  const count = useMemo(() => {
    if (pagination) {
      return Math.ceil(pagination.total / pagination.limit)
    } else {
      return 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.total, pagination?.limit])

  return {
    count: count,
    page: currentPage,
    onPaginationChange: (_: ChangeEvent<unknown>, page: number) => {
      router.replace({
        pathname: location.pathname,
        search: new URLSearchParams({
          ...query,
          skip: (page - 1).toString()
        }).toString()
      })
    },
    onRowsPerPageChange: (event: SelectChangeEvent<unknown>) => {
      table?.setPageSize(Number(event.target.value))
      router.replace({
        pathname: location.pathname,
        search: new URLSearchParams({
          ...query,
          limit: Number(event.target.value).toString()
        }).toString()
      })
    }
  }
}