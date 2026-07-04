import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import EditInvoiceComp from '../../components/editInvoice/EditInvoiceComp'
import { employeeEditInvoice, employeeGetInvoiceById } from '../../../../apis/invoice/empInvoiceApi'

export default function EmployeeEditInvoice() {
  const param = useParams()

  return (
    <div>
      <EditInvoiceComp
        id={param?._id}
        getInvoice={employeeGetInvoiceById}
        editInvoice={employeeEditInvoice}
        allInvoiceUrl={"/employee/all-invoices"}
      />
    </div>
  )
}
