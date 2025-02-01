import { adminChangeCaseStatus, adminShareCaseToEmployee, adminAllCaseDownload,adminGetNormalEmployee } from "../../../apis"
import { adminSetCaseIsActive,allAdminCase } from "../../../apis"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"

export default function AllAdminCase() {
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
      isEdit={true}
      isChangeStatus={true}
      isRemoveCase={true}
      isAddRefence={true}
      isDownload={true}
      isShare={true}
      isReject={false}
      getNormalEmp={adminGetNormalEmployee}
      caseShare={adminShareCaseToEmployee}
      createInvUrl={"/admin/create-invoice/"}
    />
  </>)
}