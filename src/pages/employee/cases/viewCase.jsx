import { API_BASE_IMG, employeeAttachementUpload } from "../../../apis/upload"
import { useParams } from "react-router-dom"
import { employeeGetCaseById,employeeChangeCaseStatus,empAddCaseReference,empRemoveCaseReference, empAddOrUpdatePayment, empOpCreateOrUpdateCaseFormApi } from "../../../apis"
import { AppContext } from "../../../App"
import { useContext } from "react"
import { employeeAddCaseComment } from "../../../apis"
import ViewCaseComp from "../../../components/Reuse/ViewCaseComp"

export default function EmployeeViewCase() {
    const state = useContext(AppContext)
    const {empType,designation}  = state?.myAppData?.details
    const param = useParams()

    return (<>
          <ViewCaseComp id={param?._id} 
      getCase={employeeGetCaseById} 
      role={"employee"}
      viewEmp={"/employee/profile/"}  
      attachementUpload={employeeAttachementUpload}
      editUrl={empType?.toLowerCase()==="operation" && "/employee/edit-case/"} 
      viewPartner={"/employee/partner details/"}
      viewClient={"/employee/client details/"}
    //   editCaseProcess={adminEditCaseProcessById}
      addCaseProcess={employeeChangeCaseStatus}
      addReference={empAddCaseReference}
      isAddRefence={empType?.toLowerCase()==="operation"}
      isViewProfile={empType?.toLowerCase()==="operation" || empType?.toLowerCase()==="branch" || (empType?.toLowerCase()==="sales" && designation?.toLowerCase()==="manager")}
      isAddCaseProcess={empType?.toLowerCase()==="operation"}
      isAddCommit={empType?.toLowerCase()==="operation" || empType?.toLowerCase()==="branch" || (empType?.toLowerCase()===" " && designation?.toLowerCase()==="manager")}
      deleteReference={empRemoveCaseReference}
      deleteDoc={()=>{}}
      addCaseCommit={employeeAddCaseComment}
      accessPayment={empType?.toLowerCase()==="operation"}
      paymentDetailsApi={empAddOrUpdatePayment}
      isCaseFormAccess={empType?.toLowerCase()==="operation"}
      createOrUpdateCaseFormApi={empOpCreateOrUpdateCaseFormApi}
      />
    </>)
}