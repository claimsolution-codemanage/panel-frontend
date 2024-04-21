import { allCasePartner } from "../../../apis"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"


export default function AllPartnerCase() {
  return (<>
    <ViewAllCaseComp 
  getCases={allCasePartner} 
  downloadCase={()=>{}} 
  role={"partner"} 
  setStatus={()=>{}} 
  setCaseStatus={()=>{}} 
  viewUrl={"/partner/view case/"}
  caseShare={()=>{}}
  isResolvedAmt={true}
  />
  </>)
}