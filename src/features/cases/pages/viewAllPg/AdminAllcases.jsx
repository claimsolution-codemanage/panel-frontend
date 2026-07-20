import { adminShareCaseToEmployee, adminAllCaseDownload, adminGetNormalEmployee } from "../../../../apis"
import { adminChangeCaseStatusApi, adminSetCaseIsActiveApi, allAdminCaseApi } from "../../../../apis/case/adminCaseApi"
import { adminAttachementUpload } from "../../../../apis/upload"
import ViewAllCaseComp from "../../components/viewAllComp/ViewAllCaseComp"

export default function AllAdminCase() {
  return (<>
    <ViewAllCaseComp
      isBack={false}
      getCases={allAdminCaseApi}
      downloadCase={adminAllCaseDownload}
      role={"admin"}
      setStatus={adminChangeCaseStatusApi}
      setCaseStatus={adminSetCaseIsActiveApi}
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
      attachementUpload={adminAttachementUpload}

    />
  </>)
}