import { getClientProfile, adminGetClientById } from "../../apis"
import { useParams } from "react-router-dom"
import ViewClientComp from "../../components/Reuse/viewClientComp"

export default function AdminClientDetails() {
    const param = useParams()
    return (<>
     <ViewClientComp id={param?._id} getClient={adminGetClientById} isEdit={true} link={`/admin/edit-client/${param?._id}`} role="admin"/>
    </>)
}