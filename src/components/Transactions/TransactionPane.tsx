import { useState, useEffect } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  // const [setLoading] = useState(transaction.loading)
  // console.log(`approved: ${approved}`)
  // console.log(`loading: ${loading}`); //false that does not disable checkbox

  // useEffect(()=> {
  //   setApproved(!approved)
  // }, [onChange])

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          console.log(newValue)

           await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          })
           setApproved(newValue)

        }}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
