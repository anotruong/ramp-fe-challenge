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
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)

  // '?.' operator returns 'undefined' if an object is undefined or null.
  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee,
    // console.log(paginatedTransactions.data),
    [paginatedTransactions, transactionsByEmployee]
  )

  /* Resolved Bug 5: Employee Data not availabe during loading more data.

    Solution: 'setIsLoading(false)' is invoked after the 'paginatedTransactiosnUtil.fetchAll()'. Invoking 'setIsLoading(false)' before 'paginatedTranactionsUntil.fetchAll()' will resolve the issue.
  */

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    setIsLoading(false)

    await paginatedTransactionsUtils.fetchAll()
    // console.log(transactions)

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
        // console.log(transactions)

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

  
  {/* Bug 7: 
    Find where the informtion is being pulled from and send change back so the app persisteses the data.
  */}

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
