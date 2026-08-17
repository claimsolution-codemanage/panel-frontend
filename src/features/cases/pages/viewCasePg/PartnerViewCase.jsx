import { useParams } from "react-router-dom"
import { partnerAttachementUpload } from "../../../../apis/upload"
import ViewCaseComp from "../../components/viewComp/ViewCaseComp"
import { partnerGetCaseFormByIdApi } from "../../../../apis/case/form/partnerCaseFormApi"
import { partnerAddCaseFileByIdApi, partnerGetCaseByIdApi, partnerViewCaseDocsByIdApi, partnerViewCaseProcessStepsByIdApi } from "../../../../apis/case/partnerCaseApi"
export default function PartnerViewCase() {
    const param = useParams()

    return (<>
        <ViewCaseComp id={param?._id}
            getCase={partnerGetCaseByIdApi}
            role={"partner"}
            addCaseDoc={partnerAddCaseFileByIdApi}
            attachementUpload={partnerAttachementUpload}
            accessPayment={false}
            paymentDetailsApi={() => { }}
            caseFormDetailApi={partnerGetCaseFormByIdApi}
            isCaseFromAccess={false}
            isCaseProcess={true}
            isPaymentAccess={false}

            getCaseDocumentApi={partnerViewCaseDocsByIdApi}
            getCaseProcessListApi={partnerViewCaseProcessStepsByIdApi}
        />
    </>)
}