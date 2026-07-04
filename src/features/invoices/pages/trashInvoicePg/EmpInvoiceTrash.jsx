import React from 'react'
import { financeEmployeeViewAllTrashInvoice } from '../../../../apis'
import AllInvoiceComp from '../../components/allInvoice/AllInvoiceComp'
import { employeeRemoveInvoice, employeeUnActiveInvoice } from '../../../../apis/invoice/empInvoiceApi'

export default function EmployeeInvoiceTrash() {
  return (
    <AllInvoiceComp
      viewAllInvoice={financeEmployeeViewAllTrashInvoice}
      payInvoice={() => { }}
      viewInvoiceUrl={"/employee/view-invoice/"}
      role={"employee"}
      isEdit={true}
      isDelete={true}
      isTrash={true}
      editInvoiceUrl={"/employee/edit-invoice/"}
      unactiveInvoice={employeeUnActiveInvoice}
      deleteInvoice={employeeRemoveInvoice}
      downloadAccess={false}
      downloadApi={() => { }}
    />
  )
}
