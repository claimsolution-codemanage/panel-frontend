import { addNewCasePartner } from "../../../../apis"
import { partnerAttachementUpload } from "../../../../apis/upload"
import AddCaseComp from "../../components/addCaseComp/AddCaseComp"


export default function NewCase() {
    return (<>
     <AddCaseComp 
     addCase={addNewCasePartner} 
     uploadAttachment={partnerAttachementUpload} 
     successUrl={"/partner/view case/"} 
     role="partner"/>
    </>)
}