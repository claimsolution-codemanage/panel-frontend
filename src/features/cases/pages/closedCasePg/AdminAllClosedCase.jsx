import { adminAllCaseDownload } from "../../../../apis"
import { allAdminCaseApi } from "../../../../apis/case/adminCaseApi"
import { adminAttachementUpload } from "../../../../apis/upload"
import ViewAllCaseComp from "../../components/viewAllComp/ViewAllCaseComp"

export default function AdminClosedCasePage() {
    return (<>
        <ViewAllCaseComp
            pageTxt={"Closed Case"}
            isBack={false}
            getCases={allAdminCaseApi}
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