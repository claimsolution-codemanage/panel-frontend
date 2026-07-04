import { useParams } from 'react-router-dom'
import CreateInvoiceComp from '../../components/addInvoice/CreateInvoiceComp'
import { empFindCaseByFileNoApi } from '../../../../apis/case/empCaseApi'
import { employeeCreateInvoice, empNextInvoiceNumber } from '../../../../apis/invoice/empInvoiceApi'

// not for client --> office 
export default function EmployeeAddInvoice() {
  const caseParam = useParams()
  return (
    <div>
      <CreateInvoiceComp
        createInvoice={employeeCreateInvoice}
        clientId={caseParam?.clientId}
        caseId={caseParam?.caseId}
        isOffice={true}
        viewInvoiceUrl={"/employee/view-invoice/"}
        fileDetailApi={empFindCaseByFileNoApi}
        nextInvoiceNoApi={empNextInvoiceNumber}

      />
    </div>
  )
}
