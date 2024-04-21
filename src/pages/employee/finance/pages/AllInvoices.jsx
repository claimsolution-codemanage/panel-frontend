import {financeEmployeeViewAllInvoice,financeEmployeeUnactiveInvoice } from "../../../../apis"
import AllInvoiceComp from "../../../../components/Reuse/AllInvoiceComp";


export default function EmployeeAllInvoices() {
  return (<>
      <AllInvoiceComp
    viewAllInvoice={financeEmployeeViewAllInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/employee/view-invoice/"}
    role={"employee"}
    isEdit={true}
    isDelete={true}
    isTrash={false}
    editInvoiceUrl={"/employee/edit-invoice/"}
    unactiveInvoice={financeEmployeeUnactiveInvoice}
    />
  </>)
}