import { adminAddOrUpdateCaseComment } from "../../../../apis"
import { useParams } from "react-router-dom"
import { adminSetCaseDocIsActive } from "../../../../apis"
import { adminAttachementUpload } from "../../../../apis/upload"
import ViewCaseComp from "../../components/viewComp/ViewCaseComp"
import { adminCreateOrUpdateCaseFormApi, adminGetCaseFormById } from "../../../../apis/case/form/caseFormApi"
import { adminAddCaseFileByIdApi, adminAddCaseReferenceApi, adminAddOrUpdatePaymentApi, adminChangeCaseStatusApi, adminDeleteCaseDocByIdApi, adminEditCaseProcessById, adminGetCaseByIdApi, adminRemoveCaseReferenceApi, adminRenameCaseDocFolderApi } from "../../../../apis/case/adminCaseApi"

export default function AdminViewCase() {
  const param = useParams()

  return (<>
    <ViewCaseComp id={param?._id}
      getCase={adminGetCaseByIdApi}
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
      addCaseProcess={adminChangeCaseStatusApi}
      addReference={adminAddCaseReferenceApi}
      deleteReference={adminRemoveCaseReferenceApi}
      deleteDoc={adminDeleteCaseDocByIdApi}
      addCaseCommit={adminAddOrUpdateCaseComment}
      setCaseDocStatus={adminSetCaseDocIsActive}
      accessPayment={true}
      paymentDetailsApi={adminAddOrUpdatePaymentApi}
      isCaseFormAccess={true}
      createOrUpdateCaseFormApi={adminCreateOrUpdateCaseFormApi}
      caseFormDetailApi={adminGetCaseFormById}
      addCaseDoc={adminAddCaseFileByIdApi}
      privateCommit={true}
      isCaseFromAccess={true}
      isCaseProcess={true}
      isPaymentAccess={true}
      renameDocFolder={adminRenameCaseDocFolderApi}
      isRenameDocFolder={true}
    />
  </>)
}