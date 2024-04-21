import { getPartnerProfile } from "../../apis";
import { imageUpload,updatePartnerProfile,updatePartnerBankingDetails } from "../../apis";
import { partnerImageUpload } from "../../apis/upload";
import EditPartnerProfileComp from "../../components/Reuse/EditPartnerProfileComp";

export default function EditProfile() {
    return (<>
    <EditPartnerProfileComp
    getPartner={getPartnerProfile}
    updateProfile={updatePartnerProfile}
    updateBanking={updatePartnerBankingDetails}
    id={1} 
    role={"partner"}
    imageUpload={partnerImageUpload} 
    />
    </>)
}