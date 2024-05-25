import { allCasePartner,partnerAllCaseDownload } from "../../../apis"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"


export default function AllPartnerCase() {
  return (<>
    <ViewAllCaseComp 
    isBack={false}
  getCases={allCasePartner} 
  downloadCase={partnerAllCaseDownload} 
  role={"partner"} 
  setStatus={()=>{}} 
  setCaseStatus={()=>{}} 
  viewUrl={"/partner/view case/"}
  caseShare={()=>{}}
  isResolvedAmt={true}
  isDownload={true}
  />
  </>)
}