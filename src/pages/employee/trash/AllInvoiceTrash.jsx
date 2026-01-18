import { useContext } from "react";
import { AppContext } from "../../../App";
import {financeEmployeeViewAllInvoice,financeEmployeeUnactiveInvoice,empOperationPaidInvoice, empDownloadAllInvoiceApi } from "../../../apis"
import AllInvoiceComp from "../../../features/invoices/components/allInvoice/AllInvoiceComp";
import { empDeleteInvoiceById } from "../../../apis/invoice/empInvoiceApi";


export default function EmpAllInvoiceTrash() {
  const state = useContext(AppContext)
  const empType  = state?.myAppData?.details?.empType
  return (<>
      <AllInvoiceComp
    viewAllInvoice={financeEmployeeViewAllInvoice}
    payInvoice={()=>{}}
    viewInvoiceUrl={"/employee/view-invoice/"}
    role={"employee"}
    isEdit={true}
    isDelete={true}
    isTrash={true}
    isPerDelete={empType?.toLowerCase()=="operation"}
    deleteInvoice={empDeleteInvoiceById}
    editInvoiceUrl={"/employee/edit-invoice/"}
    unactiveInvoice={financeEmployeeUnactiveInvoice}
    downloadAccess={false}
    downloadApi={()=>{}}
    />
  </>)
}