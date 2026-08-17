import { partnerSendEmailVerifyOtpApi, partnerVerifyOtpApi } from "../../../../apis/auth/partnerAuthApi"
import { addNewCasePartnerApi } from "../../../../apis/case/partnerCaseApi"
import { partnerAttachementUpload } from "../../../../apis/upload"
import AddCaseComp from "../../components/addCaseComp/AddCaseComp"


export default function NewCase() {
    return (<>
        <AddCaseComp
            addCase={addNewCasePartnerApi}
            uploadAttachment={partnerAttachementUpload}
            successUrl={"/partner/view case/"}
            role="partner"
            viewServiceAgreementUrl={'/partner/service-agreement'}
            sendEmailVerifyOtpApi={partnerSendEmailVerifyOtpApi}
            verifyEmailApi={partnerVerifyOtpApi}
        />
    </>)
}