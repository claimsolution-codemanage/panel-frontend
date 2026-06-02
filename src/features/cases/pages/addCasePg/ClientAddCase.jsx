import { clientAddNewCase } from "../../../../apis"
import { clientEmailVerifyApi, clientSendEmailVerifyOtpApi } from "../../../../apis/auth/userAuthApi"
import { clientAttachementUpload } from "../../../../apis/upload"
import AddCaseComp from "../../components/addCaseComp/AddCaseComp"

export default function ClientNewCase() {
    return (<>
        <div>
            <AddCaseComp 
            addCase={clientAddNewCase} 
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