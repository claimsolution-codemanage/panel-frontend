import { useContext } from "react";
import { AppContext } from "../../../../App";
import {financeEmployeeViewAllInvoice,financeEmployeeUnactiveInvoice,empOperationPaidInvoice, empDownloadAllInvoiceApi } from "../../../../apis"
import AllInvoiceComp from "../../components/allInvoice/AllInvoiceComp";


export default function EmployeeAllInvoices() {
  const state = useContext(AppContext)
  const empType  = state?.myAppData?.details?.empType
  return (<>
      <AllInvoiceComp
    viewAllInvoice={financeEmployeeViewAllInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/employee/view-invoice/"}
    role={"employee"}
    isEdit={true}
    paidAccess={empType?.toLowerCase()==="operation"}
    handlePaid={empOperationPaidInvoice}
    isDelete={true}
    isTrash={false}
    editInvoiceUrl={"/employee/edit-invoice/"}
    unactiveInvoice={financeEmployeeUnactiveInvoice}
    downloadAccess={empType?.toLowerCase()==="operation" || empType?.toLowerCase()==="finance"}
    downloadApi={empDownloadAllInvoiceApi}
    />
  </>)
}