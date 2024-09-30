import { addNewCasePartner} from "../../../apis"
import { useParams } from "react-router-dom"
import { partnerGetCaseById,partnerUpdateCaseById } from "../../../apis"
import { partnerAttachementUpload } from "../../../apis/upload"
import EditCaseComp from "../../../components/Reuse/EditCaseComp"


export default function PartnerEditCase() {
    const params = useParams()
    return (<>
    <EditCaseComp
    id={params?._id} 
    viewCase={partnerGetCaseById} 
    updateCase={partnerUpdateCaseById} 
    attachementUpload={partnerAttachementUpload}
    successUrl={"/partner/view case/"}
    addCase={addNewCasePartner}
    />
    </>)
}