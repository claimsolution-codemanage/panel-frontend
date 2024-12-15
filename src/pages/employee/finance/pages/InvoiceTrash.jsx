import React from 'react'
import AllInvoiceComp from '../../../../components/Reuse/AllInvoiceComp'
import { financeEmployeeUnactiveInvoice,financeEmployeeViewAllTrashInvoice,financeEmployeeRemoveInvoice } from '../../../../apis'

export default function EmployeeInvoiceTrash() {
  return (
    <AllInvoiceComp
    viewAllInvoice={financeEmployeeViewAllTrashInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/employee/view-invoice/"}
    role={"employee"}
    isEdit={true}
    isDelete={true}
    isTrash={true}
    editInvoiceUrl={"/employee/edit-invoice/"}
    unactiveInvoice={financeEmployeeUnactiveInvoice}
    deleteInvoice={financeEmployeeRemoveInvoice}
    downloadAccess={false}
    downloadApi={()=>{}}
    />
  )
}
