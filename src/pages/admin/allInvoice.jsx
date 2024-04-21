import React from 'react'
import AllInvoiceComp from '../../components/Reuse/AllInvoiceComp'
import { adminViewAllInvoice,adminUnactiveInvoice } from '../../apis'

export default function AdminAllInvoice() {
  return (
    <AllInvoiceComp
    viewAllInvoice={adminViewAllInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/admin/view-invoice/"}
    role={"admin"}
    isEdit={true}
    isDelete={true}
    isTrash={false}
    editInvoiceUrl={"/admin/edit-invoice/"}
    unactiveInvoice={adminUnactiveInvoice}
    />
  )
}
