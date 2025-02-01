import React from 'react'
import CreateInvoiceComp from '../../../components/Reuse/CreateInvoiceComp'
import { adminCreateInvoice } from '../../../apis'
import { useNavigate, useParams } from 'react-router-dom'

export default function AdminCreateInvoice() {
    const caseParam = useParams()
  return (
    <CreateInvoiceComp 
    createInvoice={adminCreateInvoice} 
    clientId={caseParam?.clientId}
    caseId={caseParam?.caseId}
    viewInvoiceUrl={"/admin/view-invoice/"}
    />
  )
}
