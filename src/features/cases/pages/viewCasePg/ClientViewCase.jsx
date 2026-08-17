import { useParams } from "react-router-dom"
import ViewCaseComp from "../../components/viewComp/ViewCaseComp"
import { clientAttachementUpload } from "../../../../apis/upload"
import { clientGetCaseFormByIdApi } from "../../../../apis/case/form/clientCaseFormApi"
import { clientAddCaseFileByIdApi, clientViewCaseByIdApi, getClientCaseDocumentListApi, getClientCaseProcessListApi } from "../../../../apis/case/clientCaseApi"




export default function ClientViewCase() {
    const param = useParams()
    return (<>
        <ViewCaseComp id={param?._id}
            getCase={clientViewCaseByIdApi}
            role={"client"}
            attachementUpload={clientAttachementUpload}
            addCaseDoc={clientAddCaseFileByIdApi}
            accessPayment={false}
            paymentDetailsApi={() => { }}
            caseFormDetailApi={clientGetCaseFormByIdApi}
            isCaseFromAccess={false}
            isCaseProcess={true}
            isPaymentAccess={true}

            getCaseDocumentApi={getClientCaseDocumentListApi}
            getCaseProcessListApi={getClientCaseProcessListApi}
        />
    </>)
}