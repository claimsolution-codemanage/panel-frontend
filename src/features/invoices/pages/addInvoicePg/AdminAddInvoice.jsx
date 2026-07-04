import React from 'react'
import CreateInvoiceComp from '../../components/addInvoice/CreateInvoiceComp'
import { adminFindCaseByFileNoApi } from '../../../../apis'
import { useNavigate, useParams } from 'react-router-dom'
import { adminCreateInvoiceApi, adminNextInvoiceNumberApi } from '../../../../apis/invoice/adminInvoiceApi'

export default function AdminAddInvoice() {
  const caseParam = useParams()
  return (
    <CreateInvoiceComp
      createInvoice={adminCreateInvoiceApi}
      clientId={caseParam?.clientId}
      caseId={caseParam?.caseId}
      isOffice={true}
      viewInvoiceUrl={"/admin/view-invoice/"}
      fileDetailApi={adminFindCaseByFileNoApi}
      nextInvoiceNoApi={adminNextInvoiceNumberApi}
    />
  )
}

