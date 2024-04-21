import { employeeAllCase } from "../../apis"
import { employeeChangeCaseStatus } from "../../apis"
import { AppContext } from "../../App"
import { useContext} from "react"
import ViewAllCaseComp from "../../components/Reuse/ViewAllCaseComp"
 
export default function EmployeeAllCase() {
  const state = useContext(AppContext)
  const empType  = state?.myAppData?.details?.empType

  return (<>
      <ViewAllCaseComp
      getCases={employeeAllCase}
      downloadCase={()=>{}}
      role={"employee"}
      setStatus={employeeChangeCaseStatus}
      setCaseStatus={()=>{}}
      viewUrl={"/employee/view case/"}
      editUrl={"/employee/edit-case/"}
      caseShare={()=>{}}
      isEdit={empType?.toLowerCase()==="operation"}
      isChangeStatus={empType?.toLowerCase()==="operation"}
      isRemoveCase={false}
      createInvUrl={empType?.toLowerCase()==="finance" ?  "/employee/create-invoice/" : ""}
    /> 
  </>)
}