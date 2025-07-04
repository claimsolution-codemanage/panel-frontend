import { adminChangeCaseStatus, adminShareCaseToEmployee, adminAllCaseDownload,adminGetNormalEmployee, adminSetCaseIsActive } from "../../../apis"
import { allAdminCase } from "../../../apis"
import { adminAttachementUpload } from "../../../apis/upload"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"

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
      isShare={false}
      isReject={true}
      getNormalEmp={adminGetNormalEmployee}
      caseShare={adminShareCaseToEmployee}
      attachementUpload={adminAttachementUpload}
      // createInvUrl={"/admin/create-invoice/"}
    />
  </>)
}