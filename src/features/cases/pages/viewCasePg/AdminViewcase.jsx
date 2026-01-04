import { adminAddCaseFileByIdApi, adminAddOrUpdateCaseComment, adminAddOrUpdatePayment, adminGetCaseById } from "../../../../apis"
import { useParams } from "react-router-dom"
import { adminDeleteCaseDocById,adminSetCaseDocIsActive,adminEditCaseProcessById,adminChangeCaseStatus,adminRemoveCaseReference } from "../../../../apis"
import { adminAddCaseReference } from "../../../../apis"
import { adminAttachementUpload } from "../../../../apis/upload"
import ViewCaseComp from "../../components/viewComp/ViewCaseComp"
import { adminCreateOrUpdateCaseFormApi, adminGetCaseFormById } from "../../../../apis/case/form/caseFormApi"

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
      viewOtherClientCasePath={"/admin/view case/"}
      isViewOtherClientCase={true}
      
      isViewProfile={true}
      isAddRefence={true}
      isAddCaseProcess={true}
      isAddCommit={true}
      editCaseProcess={adminEditCaseProcessById}
      addCaseProcess={adminChangeCaseStatus}
      addReference={adminAddCaseReference}
      deleteReference={adminRemoveCaseReference}
      deleteDoc={adminDeleteCaseDocById}
      addCaseCommit={adminAddOrUpdateCaseComment}
      setCaseDocStatus={adminSetCaseDocIsActive}
      accessPayment={true}
      paymentDetailsApi={adminAddOrUpdatePayment}
      isCaseFormAccess={true}
      createOrUpdateCaseFormApi={adminCreateOrUpdateCaseFormApi}
      caseFormDetailApi={adminGetCaseFormById}
      addCaseDoc={adminAddCaseFileByIdApi}
      privateCommit={true}
      />
    </>)
}