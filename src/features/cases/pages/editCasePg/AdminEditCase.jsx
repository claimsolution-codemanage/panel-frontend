import { useParams } from "react-router-dom"
import { adminAttachementUpload } from "../../../../apis/upload"
import EditCaseComp from "../../../../components/Reuse/EditCaseComp"
import { adminGetCaseByIdApi, adminUpdateCaseByIdApi } from "../../../../apis/case/adminCaseApi"


export default function AdminEditCase() {
    const params = useParams()
    return (<>
        <EditCaseComp
            id={params?._id}
            viewCase={adminGetCaseByIdApi}
            updateCase={adminUpdateCaseByIdApi}
            attachementUpload={adminAttachementUpload}
            successUrl={"/admin/view case/"}
            addCase={() => { }}
        />
    </>)
}