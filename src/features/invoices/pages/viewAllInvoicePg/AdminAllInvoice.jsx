import React from 'react'
import AllInvoiceComp from '../../components/allInvoice/AllInvoiceComp'
import { adminDownloadAllInvoiceApi, adminPaidInvoiceApi, adminUnactiveInvoiceApi, adminViewAllInvoiceApi } from '../../../../apis/invoice/adminInvoiceApi'

export default function AdminAllInvoice() {
  return (
    <AllInvoiceComp
      viewAllInvoice={adminViewAllInvoiceApi}
      payInvoice={() => { }}
      viewInvoiceUrl={"/admin/view-invoice/"}
      role={"admin"}
      isEdit={true}
      isDelete={true}
      isPerDelete={false}
      isTrash={false}
      paidAccess={true}
      handlePaid={adminPaidInvoiceApi}
      editInvoiceUrl={"/admin/edit-invoice/"}
      unactiveInvoice={adminUnactiveInvoiceApi}
      downloadAccess={true}
      downloadApi={adminDownloadAllInvoiceApi}
    />
  )
}
