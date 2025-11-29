import { adminChangeCaseStatus, adminShareCaseToEmployee,adminGetNormalEmployee } from "../../../apis"
import { allAdminCase } from "../../../apis"
import { adminAttachementUpload } from "../../../apis/upload"
import CaseWeeklyFollowUpComp from "../../../components/Common/WeeklyFollowUp/CaseWeeklyFollowUpComp"

export default function AdminCaseWeeeklyFollowUp() {
  return (<>
    <CaseWeeklyFollowUpComp
    isBack={false}
      getCases={allAdminCase}
      role={"admin"}
      setStatus={adminChangeCaseStatus}
      viewUrl={"/admin/view case/"}
      editUrl={"/admin/edit%20case/"}
      isEdit={true}
      isChangeStatus={true}
      isReject={false}
      getNormalEmp={adminGetNormalEmployee}
      caseShare={adminShareCaseToEmployee}
      attachementUpload={adminAttachementUpload}
    />
  </>)
}