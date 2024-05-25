import { employeeAllPartner,empDownloadAllPartner,empOperationChangeBranch } from "../../apis"
import { useContext } from "react"
import { AppContext } from "../../App"
import AllPartnerComp from "../../components/Reuse/AllPartnerComp"
import { useParams } from "react-router-dom"

 
export default function EmployeeAllPartner() {
  const state = useContext(AppContext)
  const param = useParams()
  const empType  = state?.myAppData?.details?.empType
  return (<>
      <AllPartnerComp 
      isBack={param?._id ? true :false}
      role={"employee"}
      empId={param?._id ? param?._id :false} 
      isShare={false}
      isTrash={false}
      isDelete={false}
      getPartner={employeeAllPartner} 
      editUrl={empType?.toLowerCase()=="operation" && '/employee/edit-partner/'}
      reportUrl={'/employee/partner-report/'}
      viewUrl={'/employee/partner details/'}
      isDownload={true}
      showType={true}
      // showType={true}
      downloadPartner={empDownloadAllPartner}
      partnerShare={()=>{}}
      isChangeBranch={empType?.toLowerCase()=="operation"}
      handleBrachChange={empOperationChangeBranch}
      unactive={()=>{}}
      isType={empType?.toLowerCase()!="operation" }
      />
</>)
}