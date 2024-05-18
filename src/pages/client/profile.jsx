import { getClientProfile } from "../../apis"
import ViewClientComp from "../../components/Reuse/viewClientComp"
import { useContext } from "react"
import { AppContext } from "../../App"

export default function ClientProfile() {
    const state = useContext(AppContext)
    const id  = state?.myAppData?.details?._id

    return (<>
            <div>
                <ViewClientComp id={id} getClient={getClientProfile} isEdit={true} link={`/client/edit profile/${id}`} role="client"/>
            </div>
    </>)
}