import React, { useEffect, useState, useRef } from 'react'
import { financeEmployeeCreateInvoice } from '../../../../apis'
import { useNavigate, useParams } from 'react-router-dom'
import CreateInvoiceComp from '../../../../components/Reuse/CreateInvoiceComp'

// not for client --> office 
export default function EmployeeAddInvoice() {
  const caseParam = useParams()
  return (
    <div>
      <CreateInvoiceComp
        createInvoice={financeEmployeeCreateInvoice}
        clientId={caseParam?.clientId}
        caseId={caseParam?.caseId}
        isOffice={true}
        viewInvoiceUrl={"/employee/view-invoice/"}
      />
    </div>
  )
}
