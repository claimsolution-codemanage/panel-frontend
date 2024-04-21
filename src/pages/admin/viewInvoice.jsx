import React from 'react'
import ViewInvoiceComp from '../../components/Reuse/ViewInvoiceComp'
import { adminGetInvoiceById } from '../../apis'
import {useParams} from 'react-router-dom'

export default function AdminViewInvoice() {
    const param = useParams()
  return (
    <ViewInvoiceComp
    id={param?._id}
    getInvoice={adminGetInvoiceById}
    />
  )
}
