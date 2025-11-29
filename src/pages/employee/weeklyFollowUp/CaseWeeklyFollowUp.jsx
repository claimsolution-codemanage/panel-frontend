import { employeeChangeCaseStatus,empOptGetNormalEmployee,employeeAllCase } from "../../../apis"
import { AppContext } from "../../../App"
import { useContext} from "react"
import { useParams } from "react-router-dom"
import { employeeAttachementUpload } from "../../../apis/upload"
import CaseWeeklyFollowUpComp from "../../../components/Common/WeeklyFollowUp/CaseWeeklyFollowUpComp"
 
export default function EmpCaseWeeklyFollowUp() {
  const state = useContext(AppContext)
  const param = useParams()
  const empType  = state?.myAppData?.details?.empType

  return (<>
      <CaseWeeklyFollowUpComp
      isBack={param?._id ? true :false}
      getCases={employeeAllCase}
      empId={param?._id ? param?._id :false} 
      role={"employee"}
      setStatus={employeeChangeCaseStatus}
      setCaseStatus={()=>{}}
      viewUrl={"/employee/view case/"}
      editUrl={"/employee/edit-case/"}
      isEdit={empType?.toLowerCase()==="operation"}
      isChangeStatus={empType?.toLowerCase()==="operation"}
      getNormalEmp={empOptGetNormalEmployee}
      attachementUpload={employeeAttachementUpload}
    /> 
  </>)
}