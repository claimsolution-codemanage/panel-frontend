import { useContext } from "react";
import { AppContext } from "../../../../App";
import AllInvoiceComp from "../../components/allInvoice/AllInvoiceComp";
import { employeeDownloadAllInvoiceApi, employeeOperationPaidInvoice, employeeUnActiveInvoice, employeeViewAllInvoice } from "../../../../apis/invoice/empInvoiceApi";


export default function EmployeeAllInvoices() {
  const state = useContext(AppContext)
  const empType = state?.myAppData?.details?.empType
  return (<>
    <AllInvoiceComp
      viewAllInvoice={employeeViewAllInvoice}
      payInvoice={() => { }}
      viewInvoiceUrl={"/employee/view-invoice/"}
      role={"employee"}
      isEdit={true}
      paidAccess={empType?.toLowerCase() === "operation"}
      handlePaid={employeeOperationPaidInvoice}
      isDelete={true}
      isTrash={false}
      editInvoiceUrl={"/employee/edit-invoice/"}
      unactiveInvoice={employeeUnActiveInvoice}
      downloadAccess={empType?.toLowerCase() === "operation" || empType?.toLowerCase() === "finance"}
      downloadApi={employeeDownloadAllInvoiceApi}
    />
  </>)
}