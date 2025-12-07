import { adminChangeCaseStatus, adminShareCaseToEmployee, adminAllCaseDownload, adminGetNormalEmployee, adminSetCaseIsActive } from "../../../apis"
import { allAdminCase } from "../../../apis"
import { adminAttachementUpload } from "../../../apis/upload"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"

export default function AdminClosedCasePage() {
    return (<>
        <ViewAllCaseComp
            pageTxt={"Closed Case"}
            isBack={false}
            getCases={allAdminCase}
            downloadCase={adminAllCaseDownload}
            role={"admin"}
            viewUrl={"/admin/view case/"}
            isDownload={true}
            isShare={false}
            isReject={false}
            attachementUpload={adminAttachementUpload}
            isClosed={true}
        />
    </>)
}