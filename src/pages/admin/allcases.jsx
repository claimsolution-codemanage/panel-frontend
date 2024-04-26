import { allAdminCase } from "../../apis"
import { adminChangeCaseStatus, adminShareCaseToEmployee, adminAllCaseDownload } from "../../apis"
import { adminSetCaseIsActive } from "../../apis"
import ViewAllCaseComp from "../../components/Reuse/ViewAllCaseComp"

export default function AllAdminCase() {
  return (<>
    <ViewAllCaseComp
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
      caseShare={adminShareCaseToEmployee}
      createInvUrl={"/admin/create-invoice/"}
    />
  </>)
}