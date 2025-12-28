import { useParams } from "react-router-dom"
import { employeeGetCaseById,employeeUpdateCaseById} from "../../../../apis"
import Loader from "../../../../components/Common/loader"
import { employeeAttachementUpload } from "../../../../apis/upload"
import EditCaseComp from "../../../../components/Reuse/EditCaseComp"


export default function EmployeeEditCase() {
    const params = useParams()
    return (<>
    <EditCaseComp
    id={params?._id} 
    viewCase={employeeGetCaseById} 
    updateCase={employeeUpdateCaseById} 
    attachementUpload={employeeAttachementUpload}
    successUrl={"/employee/view case/"}
    addCase={()=>{}}
    />
    </>)
}