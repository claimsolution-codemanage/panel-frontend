import AllCaseTrash from '../../../components/Common/trash/AllCaseTrash'
import { adminDeleteCaseByIdApi, adminSetCaseIsActiveApi, allAdminCaseApi } from '../../../apis/case/adminCaseApi'

export default function AdminTrashCase() {
  return (
    <div>
      <AllCaseTrash
        allCaseApi={allAdminCaseApi}
        caseStatusApi={adminSetCaseIsActiveApi}
        deleteCaseApi={adminDeleteCaseByIdApi}
        removeCasePermission={true}
        viewCasepath={"/admin/view case"}
      />
    </div>
  )
}
