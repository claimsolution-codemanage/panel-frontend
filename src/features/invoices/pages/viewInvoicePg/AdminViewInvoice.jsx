import React from 'react'
import ViewInvoiceComp from '../../components/viewInvoice/ViewInvoiceComp'
import { useParams } from 'react-router-dom'
import { adminEditInvoiceNoApi, adminGetInvoiceByIdApi } from '../../../../apis/invoice/adminInvoiceApi'

export default function AdminViewInvoice() {
  const param = useParams()
  return (
    <ViewInvoiceComp
      id={param?._id}
      getInvoice={adminGetInvoiceByIdApi}
      editInvNo={true}
      editInvNoApi={adminEditInvoiceNoApi}
    />
  )
}
