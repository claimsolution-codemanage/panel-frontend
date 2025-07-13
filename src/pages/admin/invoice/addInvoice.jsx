import React from 'react'
import CreateInvoiceComp from '../../../components/Reuse/CreateInvoiceComp'
import { adminCreateInvoice, adminFindCaseByFileNoApi } from '../../../apis'
import { useNavigate, useParams } from 'react-router-dom'

export default function AdminAddInvoice() {
    const caseParam = useParams()
  return (
    <CreateInvoiceComp 
    createInvoice={adminCreateInvoice} 
    clientId={caseParam?.clientId}
    caseId={caseParam?.caseId}
    isOffice={true}
    viewInvoiceUrl={"/admin/view-invoice/"}
    fileDetailApi={adminFindCaseByFileNoApi}
    />
  )
}

