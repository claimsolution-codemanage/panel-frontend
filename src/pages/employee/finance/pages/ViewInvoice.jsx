import { useParams } from "react-router-dom"
import {financeEmployeeGetInvoiceById } from "../../../../apis"
import ViewInvoiceComp from "../../../../components/Reuse/ViewInvoiceComp"


export default function EmployeeViewInvoice() {
  const param = useParams()
    return (<>
       <ViewInvoiceComp
    id={param?._id}
    getInvoice={financeEmployeeGetInvoiceById}
    />
 </>)
}