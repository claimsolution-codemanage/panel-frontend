import { employeeChangeCaseStatus,salesAllCaseDownload,empOptGetNormalEmployee,empOptShareSaleEmployee,employeeAllCase } from "../../../apis"
import { AppContext } from "../../../App"
import { useContext} from "react"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"
import { useParams } from "react-router-dom"
import { employeeAttachementUpload } from "../../../apis/upload"
 
export default function EmployeeRejectCase() {
  const state = useContext(AppContext)
  const param = useParams()
  const empType  = state?.myAppData?.details?.empType

  return (<>
      <ViewAllCaseComp
      isBack={param?._id ? true :false}
      getCases={employeeAllCase}
      empId={param?._id ? param?._id :false} 
      downloadCase={salesAllCaseDownload}
      role={"employee"}
      setStatus={employeeChangeCaseStatus}
      setCaseStatus={()=>{}}
      viewUrl={"/employee/view case/"}
      editUrl={"/employee/edit-case/"}
      isChangeStatus={empType?.toLowerCase()==="operation"}
      isRemoveCase={false}
      isDownload={true}
    //   isShare={empType?.toLowerCase()==="operation"}
      getNormalEmp={empOptGetNormalEmployee}
      caseShare={empOptShareSaleEmployee}
      createInvUrl={empType?.toLowerCase()==="finance" ?  "/employee/create-invoice/" : ""}
      attachementUpload={employeeAttachementUpload}
      isEdit={false}
      isShare={false}
      isReject={true}
    /> 
  </>)
}