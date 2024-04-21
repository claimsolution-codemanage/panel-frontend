import { clientAddNewCase } from "../../apis"
import { clientViewCaseById,clientUpdateCaseById } from "../../apis"
import { clientAttachementUpload } from "../../apis/upload"
import EditCaseComp from "../../components/Reuse/EditCaseComp"
import {useParams} from 'react-router-dom'
 

export default function PartnerEditCase() {
    const params = useParams()
    return (<>
    <EditCaseComp
    id={params?._id} 
    viewCase={clientViewCaseById} 
    updateCase={clientUpdateCaseById} 
    attachementUpload={clientAttachementUpload}
    successUrl={"/client/view case/"}
    addCase={clientAddNewCase}
    />
    </>)
}