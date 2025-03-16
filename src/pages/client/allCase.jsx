import { clientViewAllCase } from "../../apis"
import { clientAttachementUpload } from "../../apis/upload"
import ViewAllCaseComp from "../../components/Reuse/ViewAllCaseComp"

 
export default function ClientViewAllCase() {
  return (<>
  <ViewAllCaseComp 
  isBack={false}
  getCases={clientViewAllCase} 
  downloadCase={()=>{}} 
  role={"client"} 
  setStatus={()=>{}} 
  setCaseStatus={()=>{}} 
  viewUrl={"/client/view case/"}
  caseShare={()=>{}}
  attachementUpload={clientAttachementUpload}
  />
  </>)
}