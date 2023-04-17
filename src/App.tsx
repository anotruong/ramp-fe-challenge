import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  // const [ pageObj, setPageObj ] = useState({})
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)

  // console.log(`paginatedTransactionsUtils ${paginatedTransactionsUtils.fetchAll()}`)

  // '?.' operator returns 'undefined' if an object is undefined or null.
  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    // console.log(paginatedTransactions?.data ?? transactionsByEmployee ?? null),
    [paginatedTransactions, transactionsByEmployee]
  )

// console.log(transactions)


  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    await paginatedTransactionsUtils.fetchAll()

    setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  /*Resolved Bug 3: All Employee: unable to render complete transactions list after filtering by employee.
  - Discovery: In order to invoke the 'useEffect' for 'loadAllTransactions', two conditions must be met.
    - Condition 1: The value of 'employees' must be reassigned to 'null'.
    - Condition 2: When an empty string is passed in as an argument to 'transactionByEmployeeUtils.fetchById()', it should not throw an error.
  
  - Solution: Add an 'if/else' statement to 'loadedTransactionsByEmployee'. 
    - If the value of 'employeeId' is an empty string, invoke the function 'loadAllTransactions'.
    -Add 'loadAllTranactions' to depedency array.
  */ 
  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {

      if (employeeId === "") {
        loadAllTransactions()
      } else {
        paginatedTransactionsUtils.invalidateData();

        await transactionsByEmployeeUtils.fetchById(employeeId);
      }
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils, loadAllTransactions]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return null
            }
            
            await loadTransactionsByEmployee(newValue.id)
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {/* Everytime the grid is filtered, the transactions are reloaded to the top.
          */}

          {transactions !== null && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
