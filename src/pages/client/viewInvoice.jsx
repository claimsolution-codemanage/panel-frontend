import { clientGetInvoiceById } from "../../apis"
import ViewInvoiceComp from "../../components/Reuse/ViewInvoiceComp"
import { useParams } from "react-router-dom"


export default function ClientViewInvoice() {
  const param = useParams()
  return (<>
    <ViewInvoiceComp id={param?._id} getInvoice={clientGetInvoiceById}
      editInvNo={false}
      editInvNoApi={() => { }}
    />
  </>)
}