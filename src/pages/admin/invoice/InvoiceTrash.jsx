import React from 'react'
import AllInvoiceComp from '../../../components/Reuse/AllInvoiceComp'
import { adminViewAllTrashInvoice,adminViewAllInvoice,adminUnactiveInvoice,adminDeleteInvoice } from '../../../apis'

export default function AdminInvoiceTrash() {
  return (
    <AllInvoiceComp
    viewAllInvoice={adminViewAllTrashInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/admin/view-invoice/"}
    role={"admin"}
    isEdit={true}
    isDelete={true}
    isTrash={true}
    editInvoiceUrl={"/admin/edit-invoice/"}
    unactiveInvoice={adminUnactiveInvoice}
    deleteInvoice={adminDeleteInvoice}
    downloadAccess={false}
    downloadApi={()=>{}}
    />
  )
}
