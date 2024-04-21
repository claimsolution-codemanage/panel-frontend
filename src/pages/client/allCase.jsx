import { clientViewAllCase } from "../../apis"
import ViewAllCaseComp from "../../components/Reuse/ViewAllCaseComp"

 
export default function ClientViewAllCase() {
  return (<>
  <ViewAllCaseComp 
  getCases={clientViewAllCase} 
  downloadCase={()=>{}} 
  role={"client"} 
  setStatus={()=>{}} 
  setCaseStatus={()=>{}} 
  viewUrl={"/client/view case/"}
  caseShare={()=>{}}
  />
  </>)
}