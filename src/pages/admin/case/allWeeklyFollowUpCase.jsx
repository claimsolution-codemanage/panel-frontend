import { adminAllCaseDownload, } from "../../../apis"
import { allAdminCase } from "../../../apis"
import { adminAttachementUpload } from "../../../apis/upload"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"

export default function AdminWeeklyFollowUpPage() {
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
            isRemoveCase={false}
            isClosed={false}
            isWeeklyFollowUp={true}
            attachementUpload={adminAttachementUpload}
        />
    </>)
}