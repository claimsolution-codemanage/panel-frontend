import { useNavigate, useParams } from "react-router-dom";
import { adminUpdatePartnerProfile, adminUpdatePartnerBankingDetails, adminGetEmpProfile, adminUpdateEmployeeById } from "../../../apis";
import { adminAttachementUpload,adminImageUpload } from "../../../apis/upload";
import EditEmployeeComp from "../../../components/Reuse/EditEmployee";

export default function AdminEditEmployee() {
    const param = useParams()
    return (<>
        <EditEmployeeComp
            getProfile={adminGetEmpProfile}
            updateProfile={adminUpdateEmployeeById}
            id={param?._id}
            role={"admin"}
            joiningFormUrl={"/admin/employee/joinin-form"}
            attachementUpload={adminAttachementUpload}
            imageUpload={adminImageUpload}
        />
    </>)
}