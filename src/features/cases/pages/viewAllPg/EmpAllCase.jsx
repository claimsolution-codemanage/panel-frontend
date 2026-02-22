import { salesAllCaseDownload,empOptGetNormalEmployee,empOptShareSaleEmployee } from "../../../../apis"
import { AppContext } from "../../../../App"
import { useContext} from "react"
import ViewAllCaseComp from "../../components/viewAllComp/ViewAllCaseComp"
import { useParams } from "react-router-dom"
import { employeeAttachementUpload } from "../../../../apis/upload"
import { empAllCaseApi, empUpdateCaseStatusApi } from "../../../../apis/case/empCaseApi"
 
export default function EmployeeAllCase() {
  const state = useContext(AppContext)
  const param = useParams()
  const empType  = state?.myAppData?.details?.empType

  return (<>
      <ViewAllCaseComp
      isBack={param?._id ? true :false}
      getCases={empAllCaseApi}
      downloadCase={salesAllCaseDownload}
      role={"employee"}
      setStatus={empUpdateCaseStatusApi}
      setCaseStatus={()=>{}}
      viewUrl={"/employee/view case/"}
      editUrl={"/employee/edit-case/"}
      isEdit={empType?.toLowerCase()==="operation"}
      isChangeStatus={["operation","sales"].includes(empType?.toLowerCase())}
      isRemoveCase={false}
      isDownload={true}
      isShare={empType?.toLowerCase()==="operation"}
      getNormalEmp={empOptGetNormalEmployee}
      caseShare={empOptShareSaleEmployee}
      createInvUrl={empType?.toLowerCase()==="finance" ?  "/employee/create-invoice/" : ""}
      attachementUpload={employeeAttachementUpload}
    /> 
  </>)
}