import { useParams } from "react-router-dom"
import { adminGetCaseById,adminUpdateCaseById,} from "../../apis"
import { adminAttachementUpload } from "../../apis/upload"
import EditCaseComp from "../../components/Reuse/EditCaseComp"


export default function AdminEditCase() {
    const params = useParams()
    return (<>
        <EditCaseComp
    id={params?._id} 
    viewCase={adminGetCaseById} 
    updateCase={adminUpdateCaseById} 
    attachementUpload={adminAttachementUpload}
    successUrl={"/admin/view case/"}
    addCase={()=>{}}
    />
    </>)
}