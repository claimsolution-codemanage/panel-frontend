import React from 'react'
import AllInvoiceComp from '../../../components/Reuse/AllInvoiceComp'
import { adminViewAllInvoice,adminUnactiveInvoice,adminPaidInvoice, adminDownloadAllInvoiceApi } from '../../../apis'

export default function AdminAllInvoice() {
  return (
    <AllInvoiceComp
    viewAllInvoice={adminViewAllInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/admin/view-invoice/"}
    role={"admin"}
    isEdit={true}
    isDelete={true}
    isPerDelete={false}
    isTrash={false}
    paidAccess={true}
    handlePaid={adminPaidInvoice}
    editInvoiceUrl={"/admin/edit-invoice/"}
    unactiveInvoice={adminUnactiveInvoice}
    downloadAccess={true}
    downloadApi={adminDownloadAllInvoiceApi}
    />
  )
}
