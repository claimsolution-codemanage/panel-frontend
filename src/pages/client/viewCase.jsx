import { clientViewCaseById} from "../../apis"
import { useParams } from "react-router-dom"
import ViewCaseComp from "../../components/Reuse/ViewCaseComp"




export default function ClientViewCase() {
    const param = useParams()
    return (<>
        <ViewCaseComp id={param?._id} getCase={clientViewCaseById} role={"client"} />
    </>)
}