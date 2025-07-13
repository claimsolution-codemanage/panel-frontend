import { useParams } from "react-router-dom"
import { financeEmpEditInvoiceNoApi, financeEmployeeGetInvoiceById } from "../../../../apis"
import ViewInvoiceComp from "../../../../components/Reuse/ViewInvoiceComp"
import { AppContext } from "../../../../App"
import { useContext } from "react"


export default function EmployeeViewInvoice() {
   const state = useContext(AppContext)
   const empType = state?.myAppData?.details?.empType
   const param = useParams()
   return (<>
      <ViewInvoiceComp
         id={param?._id}
         getInvoice={financeEmployeeGetInvoiceById}
         editInvNo={["operation", "finance"]?.includes(empType?.toLowerCase())}
         editInvNoApi={financeEmpEditInvoiceNoApi}
      />
   </>)
}