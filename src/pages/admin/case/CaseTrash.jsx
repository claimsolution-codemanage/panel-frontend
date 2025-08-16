import AllCaseTrash from '../../../components/Common/trash/AllCaseTrash'
import { adminDeleteCaseById, adminSetCaseIsActive, allAdminCase } from '../../../apis'

export default function AdminTrashCase() {
  return (
    <div>
      <AllCaseTrash
      allCaseApi={allAdminCase} 
      caseStatusApi={adminSetCaseIsActive} 
      deleteCaseApi={adminDeleteCaseById}
      removeCasePermission={true}
      viewCasepath={"/admin/view case"}
      />
    </div>
  )
}
