import React from 'react'
import EditInvoiceComp from '../../components/editInvoice/EditInvoiceComp'
import { useNavigate, useParams } from 'react-router-dom'
import { adminEditInvoiceApi, adminGetInvoiceByIdApi } from '../../../../apis/invoice/adminInvoiceApi'

export default function AdminEditInvoice() {
  const param = useParams()
  return (
    <EditInvoiceComp
      id={param?._id}
      getInvoice={adminGetInvoiceByIdApi}
      editInvoice={adminEditInvoiceApi}
      allInvoiceUrl={"/admin/all-invoices"}
    />
  )
}
