import { adminGetPartnerById } from "../../apis"
import ViewPartnerComp from "../../components/Reuse/ViewPartnerComp"
import { useNavigate, useParams } from "react-router-dom";

export default function AdminPartnerDetails() {
    const param = useParams()
    return (<>
    <ViewPartnerComp id={param?._id} viewPartner={adminGetPartnerById} role={"admin"} editUrl={"/admin/edit-partner/"}/>
    </>)
}