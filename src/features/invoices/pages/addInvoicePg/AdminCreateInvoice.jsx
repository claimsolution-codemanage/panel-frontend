import React from 'react'
import CreateInvoiceComp from '../../components/addInvoice/CreateInvoiceComp'
import { useNavigate, useParams } from 'react-router-dom'
import { adminCreateInvoiceApi, adminNextInvoiceNumberApi } from '../../../../apis/invoice/adminInvoiceApi'

export default function AdminCreateInvoice() {
  const caseParam = useParams()
  return (
    <CreateInvoiceComp
      createInvoice={adminCreateInvoiceApi}
      clientId={caseParam?.clientId}
      caseId={caseParam?.caseId}
      viewInvoiceUrl={"/admin/view-invoice/"}
      nextInvoiceNoApi={adminNextInvoiceNumberApi}
    />
  )
}
