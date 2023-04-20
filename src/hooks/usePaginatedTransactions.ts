import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading, setLoading } = useCustomFetch()
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

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }

      return { data: response.data, nextPage: response.nextPage }
    })
  }, [fetchWithCache, paginatedTransactions])


  /*Resolved Bug 6:  'View More' button should not be active when the transactions are filtered by employee.
  
  Solution: Import the function 'setLoading' from the hook 'UseCustomFetch'. Add 'setLoading' as a dependency to the callback of 'useCallback' passed in as an argument to the function 'invalidateData'. Invoke 'setLoading(true)' to 'invalidateData'.*/
  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
    setLoading(true);
  }, [setLoading])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
