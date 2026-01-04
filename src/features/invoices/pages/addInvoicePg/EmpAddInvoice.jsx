import { empFindCaseByFileNoApi, financeEmployeeCreateInvoice } from '../../../../apis'
import {  useParams } from 'react-router-dom'
import CreateInvoiceComp from '../../components/addInvoice/CreateInvoiceComp'

// not for client --> office 
export default function EmployeeAddInvoice() {
  const caseParam = useParams()
  return (
    <div>
      <CreateInvoiceComp
        createInvoice={financeEmployeeCreateInvoice}
        clientId={caseParam?.clientId}
        caseId={caseParam?.caseId}
        isOffice={true}
        viewInvoiceUrl={"/employee/view-invoice/"}
        fileDetailApi={empFindCaseByFileNoApi}
        
      />
    </div>
  )
}
