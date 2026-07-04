import Statement from '../../../components/Reuse/Statement'
import { adminFindCaseByFileNoApi } from '../../../apis'
import { adminAllStatementDownloadApi, adminChangeStatementStatusApi, adminDeleteStatementApi, adminStatementsApi } from '../../../apis/statement/adminStatementApi'

export default function AllStatement() {
  return (
    <div>
      <Statement
        getStatementApi={adminStatementsApi}
        excelDownloadApi={adminAllStatementDownloadApi}
        fileDetailApi={adminFindCaseByFileNoApi}
        statementStatusUpdateApi={adminChangeStatementStatusApi}
        paidAccess={true}
        deleteStatementApi={adminDeleteStatementApi}
        deleteStatementAccess={true}
        type={"admin"} />
    </div>
  )
}
