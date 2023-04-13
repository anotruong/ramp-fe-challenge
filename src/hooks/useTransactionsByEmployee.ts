import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"
import { useEmployees } from "./useEmployees"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      let data;
      // if (employeeId !== "") {
        data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
          "transactionsByEmployee",
          {
            employeeId,
          }
        )

        setTransactionsByEmployee(data)
  },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    // console.log('this is working')
    setTransactionsByEmployee(null)
    // console.log(transactionsByEmployee)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
