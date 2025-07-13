import { empFindCaseByFileNoApi, financeEmployeeCreateInvoice } from '../../../../apis'
import {  useParams } from 'react-router-dom'
import CreateInvoiceComp from '../../../../components/Reuse/CreateInvoiceComp'

export default function EmployeeCreateInvoice() {
  const caseParam = useParams()
  return (
    <div>
      <CreateInvoiceComp
        createInvoice={financeEmployeeCreateInvoice}
        clientId={caseParam?.clientId}
        caseId={caseParam?.caseId}
        viewInvoiceUrl={"/employee/view-invoice/"}
        fileDetailApi={empFindCaseByFileNoApi}
      />
    </div>
  )
}
