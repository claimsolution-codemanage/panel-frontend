import { useParams } from "react-router-dom"
import { employeeAttachementUpload } from "../../../../apis/upload"
import EditCaseComp from "../../../../components/Reuse/EditCaseComp"
import { empGetCaseById, empUpdateCaseById } from "../../../../apis/case/empCaseApi"


export default function EmployeeEditCase() {
    const params = useParams()
    return (<>
    <EditCaseComp
    id={params?._id} 
    viewCase={empGetCaseById} 
    updateCase={empUpdateCaseById} 
    attachementUpload={employeeAttachementUpload}
    successUrl={"/employee/view case/"}
    addCase={()=>{}}
    />
    </>)
}