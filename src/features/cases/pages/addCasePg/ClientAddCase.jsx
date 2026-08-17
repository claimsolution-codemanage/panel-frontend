import { clientEmailVerifyApi, clientSendEmailVerifyOtpApi } from "../../../../apis/auth/userAuthApi"
import { clientAddNewCaseApi } from "../../../../apis/case/clientCaseApi"
import { clientAttachementUpload } from "../../../../apis/upload"
import AddCaseComp from "../../components/addCaseComp/AddCaseComp"

export default function ClientNewCase() {
    return (<>
        <div>
            <AddCaseComp
                addCase={clientAddNewCaseApi}
                uploadAttachment={clientAttachementUpload}
                successUrl={"/client/view case/"}
                role="client"
                viewServiceAgreementUrl={'/client/service-agreement'}
                sendEmailVerifyOtpApi={clientSendEmailVerifyOtpApi}
                verifyEmailApi={clientEmailVerifyApi}
            />
        </div>
    </>)
}