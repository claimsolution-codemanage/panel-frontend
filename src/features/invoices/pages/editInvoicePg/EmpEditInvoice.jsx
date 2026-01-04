import React, { useEffect, useState, useRef } from 'react'
import { financeEmployeeEditInvoice, financeEmployeeGetInvoiceById } from '../../../../apis'
import { useParams } from 'react-router-dom'
import EditInvoiceComp from '../../components/editInvoice/EditInvoiceComp'

export default function EmployeeEditInvoice() {
  const param = useParams()

  return (
    <div>
      <EditInvoiceComp
        id={param?._id}
        getInvoice={financeEmployeeGetInvoiceById}
        editInvoice={financeEmployeeEditInvoice}
        allInvoiceUrl={"/employee/all-invoices"}
      />
    </div>
  )
}
