import React from 'react'
import ViewInvoiceComp from '../../components/viewInvoice/ViewInvoiceComp'
import { adminEditInvoiceNoApi, adminGetInvoiceById } from '../../../../apis'
import { useParams } from 'react-router-dom'

export default function AdminViewInvoice() {
  const param = useParams()
  return (
    <ViewInvoiceComp
      id={param?._id}
      getInvoice={adminGetInvoiceById}
      editInvNo={true}
      editInvNoApi={adminEditInvoiceNoApi}
    />
  )
}
