import { partnerGetCaseById } from "../../../apis"
import { useParams } from "react-router-dom"
import { partnerAddCaseFileById } from "../../../apis"
import { partnerAttachementUpload } from "../../../apis/upload"
import ViewCaseComp from "../../../components/Reuse/ViewCaseComp"
import { partnerGetCaseFormByIdApi } from "../../../apis/case/form/partnerCaseFormApi"
export default function PartnerViewCase() {
    const param = useParams()

    return (<>
     <ViewCaseComp id={param?._id} 
     getCase={partnerGetCaseById} 
     role={"partner"} 
     addCaseDoc={partnerAddCaseFileById} 
     attachementUpload={partnerAttachementUpload}
     accessPayment={false}
     paymentDetailsApi={()=>{}}
     caseFormDetailApi={partnerGetCaseFormByIdApi}
     />
    </>)
}