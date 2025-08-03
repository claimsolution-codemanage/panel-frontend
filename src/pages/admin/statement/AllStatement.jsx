import Statement from '../../../components/Reuse/Statement'
import { adminAllStatementDownload, adminChangeStatementStatusApi, adminFindCaseByFileNoApi, adminStatements } from '../../../apis'

export default function AllStatement() {
  return (
    <div>
        <Statement 
        getStatementApi={adminStatements} 
        excelDownloadApi={adminAllStatementDownload} 
        fileDetailApi={adminFindCaseByFileNoApi} 
        statementStatusUpdateApi={adminChangeStatementStatusApi}
        paidAccess={true}
        type={"admin"}/>
    </div>
  )
}
