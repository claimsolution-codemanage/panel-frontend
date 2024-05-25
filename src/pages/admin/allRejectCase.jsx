import { allAdminCase } from "../../apis"
import { adminChangeCaseStatus, adminShareCaseToEmployee, adminAllCaseDownload,adminGetNormalEmployee } from "../../apis"
import { adminSetCaseIsActive } from "../../apis"
import ViewAllCaseComp from "../../components/Reuse/ViewAllCaseComp"

export default function AdminRejectCase() {
  return (<>
    <ViewAllCaseComp
    isBack={false}
      getCases={allAdminCase}
      downloadCase={adminAllCaseDownload}
      role={"admin"}
      setStatus={adminChangeCaseStatus}
      setCaseStatus={adminSetCaseIsActive}
      viewUrl={"/admin/view case/"}
      editUrl={"/admin/edit%20case/"}
      isEdit={false}
      isChangeStatus={true}
      isRemoveCase={true}
      isAddRefence={true}
      isDownload={true}
      isShare={true}
      isReject={true}
      getNormalEmp={adminGetNormalEmployee}
      caseShare={adminShareCaseToEmployee}
      // createInvUrl={"/admin/create-invoice/"}
    />
  </>)
}