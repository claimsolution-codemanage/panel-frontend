import React from 'react'
import AllInvoiceComp from '../../components/allInvoice/AllInvoiceComp'
import { adminDeleteInvoiceApi, adminUnactiveInvoiceApi, adminViewAllTrashInvoiceApi } from '../../../../apis/invoice/adminInvoiceApi'

export default function AdminInvoiceTrash() {
  return (
    <AllInvoiceComp
      viewAllInvoice={adminViewAllTrashInvoiceApi}
      payInvoice={() => { }}
      viewInvoiceUrl={"/admin/view-invoice/"}
      role={"admin"}
      isEdit={true}
      isDelete={true}
      isTrash={true}
      isPerDelete={true}
      editInvoiceUrl={"/admin/edit-invoice/"}
      unactiveInvoice={adminUnactiveInvoiceApi}
      deleteInvoice={adminDeleteInvoiceApi}
      downloadAccess={false}
      downloadApi={() => { }}
    />
  )
}
