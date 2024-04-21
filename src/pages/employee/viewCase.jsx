import { API_BASE_IMG, employeeAttachementUpload } from "../../apis/upload"
import { useParams } from "react-router-dom"
import { employeeGetCaseById,employeeChangeCaseStatus } from "../../apis"
import { AppContext } from "../../App"
import { useContext } from "react"
import { employeeAddCaseComment } from "../../apis"
import ViewCaseComp from "../../components/Reuse/ViewCaseComp"

export default function EmployeeViewCase() {
    const state = useContext(AppContext)
    const empType  = state?.myAppData?.details?.empType
    const param = useParams()

    return (<>
          <ViewCaseComp id={param?._id} 
      getCase={employeeGetCaseById} 
      role={"employee"}  
      attachementUpload={employeeAttachementUpload}
      editUrl={empType?.toLowerCase()==="operation" && "/employee/edit-case/"} 
      viewPartner={"/employee/partner details/"}
      viewClient={"/employee/client details/"}
    //   editCaseProcess={adminEditCaseProcessById}
      addCaseProcess={employeeChangeCaseStatus}
      addReference={()=>{}}
      isAddRefence={false}
      isViewProfile={empType?.toLowerCase()==="operation"}
      isAddCaseProcess={empType?.toLowerCase()==="operation"}
      isAddCommit={true}
      deleteReference={()=>{}}
      deleteDoc={()=>{}}
      addCaseCommit={employeeAddCaseComment}
      />
    </>)
}