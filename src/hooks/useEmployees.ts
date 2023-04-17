import { useCallback, useState } from "react"
import { Employee } from "../utils/types"
import { useCustomFetch } from "./useCustomFetch"
import { EmployeeResult } from "./types"


export function useEmployees(): EmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [employees, setEmployees] = useState <Employee[] | null>(null)

  const fetchAll = useCallback(async () => {
    const employeesData = await fetchWithCache<Employee[]>("employees")
    setEmployees(employeesData)
  }, [fetchWithCache])

  const invalidateData = useCallback(() => {
    // console.log('employee.invalidate is working')
    setEmployees(null)
    // console.log(employees)
  }, [])

  return { data: employees, loading, fetchAll, invalidateData }
}
