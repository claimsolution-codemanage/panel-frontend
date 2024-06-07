import { clientViewAllInvoice, clientPayInvoiceById } from "../../apis"
import AllInvoiceComp from "../../components/Reuse/AllInvoiceComp";


export default function ClientAllInvoice() {
  return (<>
  <AllInvoiceComp 
  role={"client"}
  viewInvoiceUrl={"/client/view-invoice/"}
  paidAccess={false}
  handlePaid={()=>{}}
  viewAllInvoice={clientViewAllInvoice} 
  payInvoice={clientPayInvoiceById}/>
  </>)
}