import { employeeAllCase,saleEmpPartnerReport } from "../../../apis"
import { employeeChangeCaseStatus,salesAllCaseDownload,empDownloadPartnerReport } from "../../../apis"
import { AppContext } from "../../../App"
import { useContext} from "react"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"
import { useParams } from "react-router-dom"
import { employeeAttachementUpload } from "../../../apis/upload"
 
export default function EmpSalePartnerReport() {
    const param = useParams()

  const state = useContext(AppContext)
  const empType  = state?.myAppData?.details?.empType


  return (<>
      <ViewAllCaseComp
      id={param?._id}
      empId={false}
      getCases={saleEmpPartnerReport}
      downloadCase={empDownloadPartnerReport}
      role={"employee"}
      setStatus={employeeChangeCaseStatus}
      setCaseStatus={()=>{}}
      viewUrl={"/employee/view case/"}
      editUrl={"/employee/edit-case/"}
      caseShare={()=>{}}
      isEdit={empType?.toLowerCase()==="operation"}
      isChangeStatus={empType?.toLowerCase()==="operation"}
      isRemoveCase={false}
      isDownload={true}
      createInvUrl={empType?.toLowerCase()==="finance" ?  "/employee/create-invoice/" : ""}
      attachementUpload={employeeAttachementUpload}
    /> 
  </>)
}