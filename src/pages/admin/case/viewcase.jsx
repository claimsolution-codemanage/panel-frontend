import { adminAddCaseFileByIdApi, adminAddOrUpdatePayment, adminCreateOrUpdateCaseFormApi, adminGetCaseById } from "../../../apis"
import { useParams } from "react-router-dom"
import { adminDeleteCaseDocById,adminUpdateClientCaseFee,adminSetCaseDocIsActive,adminEditCaseProcessById,adminChangeCaseStatus, adminAddCaseCommit, adminRemoveCaseReference } from "../../../apis"
import { adminAddCaseReference } from "../../../apis"
import { adminAttachementUpload } from "../../../apis/upload"
import ViewCaseComp from "../../../components/Reuse/ViewCaseComp"

export default function AdminViewCase() {
    const param = useParams()

    return (<>
      <ViewCaseComp id={param?._id} 
      getCase={adminGetCaseById} 
      role={"admin"}  
      attachementUpload={adminAttachementUpload}
      editUrl={"/admin/edit%20case/"} 
      viewEmp={"/admin/employee/profile/"}  
      viewPartner={"/admin/partner%20details/"}
      viewClient={"/admin/client%20details/"}
      isViewProfile={true}
      isAddRefence={true}
      isAddCaseProcess={true}
      isAddCommit={true}
      editCaseProcess={adminEditCaseProcessById}
      addCaseProcess={adminChangeCaseStatus}
      addReference={adminAddCaseReference}
      deleteReference={adminRemoveCaseReference}
      deleteDoc={adminDeleteCaseDocById}
      addCaseCommit={adminAddCaseCommit}
      setCaseDocStatus={adminSetCaseDocIsActive}
      accessPayment={true}
      paymentDetailsApi={adminAddOrUpdatePayment}
      isCaseFormAccess={true}
      createOrUpdateCaseFormApi={adminCreateOrUpdateCaseFormApi}
      addCaseDoc={adminAddCaseFileByIdApi}
      />
    </>)
}