import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

// const dataObj = {};

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  // const [testerObj, setTesterObj] = useState({});
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)
  const fetchAll = useCallback(async () => {

    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
        
      }
    )

    // setTesterObj(() => {
    //   if (response === null) {
    //     response.data.forEach(())
    //   }
    // })


    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        // console.log(typeof response)
        return response
      }

      return { data: response.data, nextPage: response.nextPage }
    })
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
