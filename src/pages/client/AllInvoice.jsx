import { clientViewAllInvoice, clientPayInvoiceById } from "../../apis"
import AllInvoiceComp from "../../components/Reuse/AllInvoiceComp";


export default function ClientAllInvoice() {
  return (<>
  <AllInvoiceComp 
  role={"client"}
  viewInvoiceUrl={"/client/view-invoice/"}
  viewAllInvoice={clientViewAllInvoice} 
  payInvoice={clientPayInvoiceById}/>
  </>)
}