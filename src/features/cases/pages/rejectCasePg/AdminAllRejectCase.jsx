import { adminShareCaseToEmployee, adminAllCaseDownload, adminGetNormalEmployee } from "../../../../apis"
import { adminChangeCaseStatusApi, adminSetCaseIsActiveApi, allAdminCaseApi } from "../../../../apis/case/adminCaseApi"
import { adminAttachementUpload } from "../../../../apis/upload"
import ViewAllCaseComp from "../../components/viewAllComp/ViewAllCaseComp"

export default function AdminRejectCase() {
  return (<>
    <ViewAllCaseComp
      pageTxt={"Reject Case"}
      isBack={false}
      getCases={allAdminCaseApi}
      downloadCase={adminAllCaseDownload}
      role={"admin"}
      setStatus={adminChangeCaseStatusApi}
      setCaseStatus={adminSetCaseIsActiveApi}
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