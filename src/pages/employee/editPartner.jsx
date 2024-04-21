import { useNavigate, useParams } from "react-router-dom";
import { employeeGetPartnerById,employeeUpdatePartnerProfile,employeeUpdatePartnerBankingDetails } from "../../apis";
import EditPartnerProfileComp from "../../components/Reuse/EditPartnerProfileComp";
import { employeeImageUpload } from "../../apis/upload";

export default function EmployeeEditPartner() {
    const param = useParams()
    return (<>
            <EditPartnerProfileComp
            getPartner={employeeGetPartnerById}
            updateProfile={employeeUpdatePartnerProfile}
            updateBanking={employeeUpdatePartnerBankingDetails}
            id={param?._id}
            role={"employee"}
            imageUpload={employeeImageUpload}
        />
    </>)
}