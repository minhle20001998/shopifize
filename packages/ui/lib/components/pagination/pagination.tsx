import { Pagination } from "@mui/material"
import { ChangeEvent, useMemo, useState } from "react";
import { PaginationResponseType } from "@shopifize/helpers";
import { useRouter } from "next/router";
import { useDeepCompareEffect } from "use-deep-compare";

export const CustomPagination = ({ pagination, onPaginationChanging }: { pagination?: PaginationResponseType , onPaginationChanging?: () => void}) => {
  const router = useRouter()
  const query = router.query
  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(query?.skip?.toString())
    return isNaN(page) ? 1 : page
  });

  useDeepCompareEffect(() => {
    setCurrentPage(Number(query?.skip?.toString()) + 1 || 1)
  }, [query])

  const onPaginationChange = async (_: ChangeEvent<unknown>, page: number) => {
    await router.replace({
      pathname: location.pathname,
      search: new URLSearchParams({
        ...query,
        skip: (page - 1).toString()
      }).toString()
    }, undefined, {scroll: false})
    onPaginationChanging?.()
  }

  const count = useMemo(() => {
    if (pagination) {
      return Math.ceil(pagination.total / pagination.limit)
    } else {
      return 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.total, pagination?.limit])

  return <>
    <Pagination count={count} page={currentPage} onChange={onPaginationChange} color="primary" />
  </>
}