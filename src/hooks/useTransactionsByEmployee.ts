import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  // console.log(transactionsByEmployee)
  const fetchById = useCallback(
    async (employeeId: string) => {
      let data = await fetchWithoutCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )

      // console.log(data) //transactions by employee 

      setTransactionsByEmployee(data)
    },
    [fetchWithoutCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
