import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types"
import mockData from "../mock-data.json"

const TRANSACTIONS_PER_PAGE = 5

const data: { employees: Employee[]; transactions: Transaction[] } = {
  employees: mockData.employees,
  transactions: mockData.transactions,
}

localStorage.setItem('shallowCopy', JSON.stringify(data))

const shallowCopy = localStorage.getItem('shallowCopy')

const shallowCopyObj = shallowCopy ? JSON.parse(shallowCopy) : null

const updateData = (newData: object) => {
  // data = newData;
  localStorage.setItem('shallowCopy', JSON.stringify(newData))
}

export const getEmployees = (): Employee[] => shallowCopyObj.employees

/*Resolve Bug 4: 'View more' button. 

  Solution: The bug is located at 'data.transactions.slice()' in 'data' property of the return statement. The value of 'page' is iterated with each invocation and in turn the value of 'state' is increased. By declaring a new constant 'startList' that is assigned to '0', the function 'getTransactionPaginated' returns a reference to an array of that stores both old and new tranactions when invoked. 
*/

export const getTransactionsPaginated = ({
  page
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  if (page === null) {
    throw new Error("Page cannot be null")
  }

  const start = page * TRANSACTIONS_PER_PAGE
  const end = start + TRANSACTIONS_PER_PAGE
  const listStart = 0;

  if (start > shallowCopyObj.transactions.length) {
    throw new Error(`Invalid page ${page}`)
  }

  const nextPage = end < shallowCopyObj.transactions.length ? page + 1 : null

  return {
    nextPage,
    data: shallowCopyObj.transactions.slice(listStart, end),
  }
}

export const getTransactionsByEmployee = ({ employeeId }: RequestByEmployeeParams) => {
  if (!employeeId) {
    throw new Error("Employee id cannot be empty")
  }

  return shallowCopyObj.transactions.filter((transaction: any) => transaction.employee.id === employeeId)
}

export const setTransactionApproval = ({ transactionId, value }: SetTransactionApprovalParams): void => {
  
  // const transaction = data.transactions.find(
  //   (currentTransaction) => currentTransaction.id === transactionId
  // )

  const transaction = shallowCopyObj.transactions.find((currentTransaction: any) => currentTransaction.id === transactionId)

  // shallowCopyObj.transactions.find((currentId) => currentId === transactionId)

  if (!transaction) {
    throw new Error("Invalid transaction to approve")
  }

  transaction.approved = value

  // console.log(shallowCopyObj)

  updateData(shallowCopyObj)
  
}