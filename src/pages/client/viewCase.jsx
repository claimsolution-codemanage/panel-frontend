import { clientViewCaseById} from "../../apis"
import { useParams } from "react-router-dom"
import ViewCaseComp from "../../components/Reuse/ViewCaseComp"
import { clientAttachementUpload } from "../../apis/upload"
import { clientAddCaseFileById } from "../../apis"
import { clientGetCaseFormByIdApi } from "../../apis/case/form/clientCaseFormApi"




export default function ClientViewCase() {
    const param = useParams()
    return (<>
        <ViewCaseComp id={param?._id} 
        getCase={clientViewCaseById} 
        role={"client"} 
        attachementUpload={clientAttachementUpload}
        addCaseDoc={clientAddCaseFileById}
        accessPayment={false}
        paymentDetailsApi={()=>{}}
        caseFormDetailApi={clientGetCaseFormByIdApi}
        />
    </>)
}