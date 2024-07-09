import { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";

export const useTableSorting: () => { sorting: SortingState, setSorting: Dispatch<SetStateAction<SortingState>> } = () => {
  const router = useRouter()
  const query = router.query
  const [sorting, setSorting] = useState<SortingState>([]);

  useDeepCompareEffect(() => {
    // url sorting filter shit works here
    const [sortField] = sorting
    if (sortField?.id && sortField?.id !== 'undefined') {
      delete query.sort
      delete query.desc
      delete query.id
      router.replace({
        pathname: location.pathname,
        search: new URLSearchParams({ sort: sortField.id, desc: sortField.desc ? 'true' : 'false', ...query as object }).toString()
      })
    } else if (!sortField?.id && sorting.length > 0) {
      delete query.sort
      delete query.desc
      delete query.id
      router.replace({
        pathname: location.pathname,
        search: new URLSearchParams({
          ...query as object
        }).toString()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])


  useEffect(() => {
    setSorting([{ id: query.sort as string, desc: query.desc === 'true' ? true : false }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    sorting, setSorting
  }
}