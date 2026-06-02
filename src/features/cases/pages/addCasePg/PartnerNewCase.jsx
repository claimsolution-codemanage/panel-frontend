import { addNewCasePartner } from "../../../../apis"
import { partnerSendEmailVerifyOtpApi, partnerVerifyOtpApi } from "../../../../apis/auth/partnerAuthApi"
import { clientEmailVerifyApi } from "../../../../apis/auth/userAuthApi"
import { partnerAttachementUpload } from "../../../../apis/upload"
import AddCaseComp from "../../components/addCaseComp/AddCaseComp"


export default function NewCase() {
    return (<>
        <AddCaseComp
            addCase={addNewCasePartner}
            uploadAttachment={partnerAttachementUpload}
            successUrl={"/partner/view case/"}
            role="partner"
            viewServiceAgreementUrl={'/partner/service-agreement'}
            sendEmailVerifyOtpApi={partnerSendEmailVerifyOtpApi}
            verifyEmailApi={partnerVerifyOtpApi}
        />
    </>)
}