
import { clientUpdateProfile, getClientProfile, } from '../../apis'
import { clientImageUpload } from '../../apis/upload'
import { useParams } from "react-router-dom"
import EditClient from '../../components/Reuse/EditClientComp'



export default function ClientEditProfile() {
    const param = useParams()
    return (
        <>
            <EditClient id={param?._id} getClient={getClientProfile} updateClient={clientUpdateProfile} uploadImg={clientImageUpload} role="client" />
        </>
    )
}