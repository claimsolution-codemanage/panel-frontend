import { useContext } from "react";
import { AppContext } from "../../../App";
import AllInvoiceComp from "../../../features/invoices/components/allInvoice/AllInvoiceComp";
import { empDeleteInvoiceById, employeeUnActiveInvoice, employeeViewAllInvoice, } from "../../../apis/invoice/empInvoiceApi";


export default function EmpAllInvoiceTrash() {
  const state = useContext(AppContext)
  const empType = state?.myAppData?.details?.empType
  return (<>
    <AllInvoiceComp
      viewAllInvoice={employeeViewAllInvoice}
      payInvoice={() => { }}
      viewInvoiceUrl={"/employee/view-invoice/"}
      role={"employee"}
      isEdit={true}
      isDelete={true}
      isTrash={true}
      isPerDelete={empType?.toLowerCase() == "operation"}
      deleteInvoice={empDeleteInvoiceById}
      editInvoiceUrl={"/employee/edit-invoice/"}
      unactiveInvoice={employeeUnActiveInvoice}
      downloadAccess={false}
      downloadApi={() => { }}
    />
  </>)
}