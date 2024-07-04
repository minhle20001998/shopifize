import { useRouter } from "next/router"
import { DefaultLimit, DefaultSkip } from "../const"

export const usePaginationQuery = () => {
  const { query } = useRouter()

  const limit = Number(query.limit?.toString() || DefaultLimit)
  const skip = (Number(query.skip?.toString()) >= 0 ? Number(query.skip?.toString()) : DefaultSkip) * limit

  return {limit, skip}
}