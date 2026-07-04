import { useParams } from "react-router-dom"
import ViewInvoiceComp from "../../components/viewInvoice/ViewInvoiceComp"
import { AppContext } from "../../../../App"
import { useContext } from "react"
import { employeeEditInvoiceNoApi, employeeGetInvoiceById } from "../../../../apis/invoice/empInvoiceApi"


export default function EmployeeViewInvoice() {
   const state = useContext(AppContext)
   const empType = state?.myAppData?.details?.empType
   const param = useParams()
   return (<>
      <ViewInvoiceComp
         id={param?._id}
         getInvoice={employeeGetInvoiceById}
         editInvNo={["operation", "finance"]?.includes(empType?.toLowerCase())}
         editInvNoApi={employeeEditInvoiceNoApi}
      />
   </>)
}