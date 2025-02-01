import { useNavigate, useParams } from "react-router-dom";
import { adminGetPartnerById, adminUpdatePartnerProfile, adminUpdatePartnerBankingDetails } from "../../../apis";
import {adminImageUpload } from "../../../apis/upload";
import EditPartnerProfileComp from "../../../components/Reuse/EditPartnerProfileComp";

export default function AdminEditPartner() {
    const param = useParams()
    return (<>
        <EditPartnerProfileComp
            getPartner={adminGetPartnerById}
            updateProfile={adminUpdatePartnerProfile}
            updateBanking={adminUpdatePartnerBankingDetails}
            id={param?._id}
            role={"admin"}
            imageUpload={adminImageUpload}
        />
    </>)
}