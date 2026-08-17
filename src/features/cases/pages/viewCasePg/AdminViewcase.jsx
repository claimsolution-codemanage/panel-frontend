import { useParams } from "react-router-dom"
import { adminSetCaseDocIsActive } from "../../../../apis"
import { adminAttachementUpload } from "../../../../apis/upload"
import ViewCaseComp from "../../components/viewComp/ViewCaseComp"
import { adminCreateOrUpdateCaseFormApi, adminGetCaseFormById } from "../../../../apis/case/form/caseFormApi"
import { adminAddCaseFileByIdApi, adminAddCaseReferenceApi, adminAddOrUpdateCaseCommentApi, adminAddOrUpdatePaymentApi, adminChangeCaseStatusApi, adminDeleteCaseDocByIdApi, adminEditCaseProcessById, adminGetCaseByIdApi, adminRemoveCaseReferenceApi, adminRenameCaseDocFolderApi, getAdminCaseDocumentListApi, getAdminCaseProcessListApi, getCaseCommentsApi, getCaseEmployeeListApi } from "../../../../apis/case/adminCaseApi"

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
      addReference={adminAddCaseReferenceApi}
      deleteReference={adminRemoveCaseReferenceApi}

      // comment
      privateCommit={true}
      isAddCommit={true}
      canTagComment={true}
      addCaseCommit={adminAddOrUpdateCaseCommentApi}
      getCaseCommentsApi={getCaseCommentsApi}
      getCaseEmployeeListApi={getCaseEmployeeListApi}
      // comment

      // document
      isRenameDocFolder={true}
      deleteDoc={adminDeleteCaseDocByIdApi}
      setCaseDocStatus={adminSetCaseDocIsActive}
      addCaseDoc={adminAddCaseFileByIdApi}
      renameDocFolder={adminRenameCaseDocFolderApi}
      getCaseDocumentApi={getAdminCaseDocumentListApi}
      // document

      // process list
      isCaseProcess={true}
      isAddCaseProcess={true}
      editCaseProcess={adminEditCaseProcessById}
      addCaseProcess={adminChangeCaseStatusApi}
      getCaseProcessListApi={getAdminCaseProcessListApi}
      // process list

      accessPayment={true}
      paymentDetailsApi={adminAddOrUpdatePaymentApi}
      isCaseFormAccess={true}
      createOrUpdateCaseFormApi={adminCreateOrUpdateCaseFormApi}
      caseFormDetailApi={adminGetCaseFormById}
      isCaseFromAccess={true}
      isPaymentAccess={true}
    />
  </>)
}