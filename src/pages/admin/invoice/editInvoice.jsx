import React from 'react'
import { adminEditInvoice,adminGetInvoiceById } from '../../../apis'
import EditInvoiceComp from '../../../components/Reuse/EditInvoiceComp'
import { useNavigate, useParams } from 'react-router-dom'

export default function AdminEditInvoice() {
    const param = useParams()
  return (
   <EditInvoiceComp
   id={param?._id}
   getInvoice={adminGetInvoiceById}
   editInvoice={adminEditInvoice}
   allInvoiceUrl={"/admin/all-invoices"}
   />
  )
}
