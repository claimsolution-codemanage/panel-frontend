import { API_BASE_IMG, employeeAttachementUpload } from "../../../../apis/upload"
import { useParams } from "react-router-dom"
import { AppContext } from "../../../../App"
import { useContext } from "react"
import ViewCaseComp from "../../components/viewComp/ViewCaseComp"
import { empCreateOrUpdateCaseFormApi, empGetCaseFormById } from "../../../../apis/case/form/caseFormApi"
import { empAddCaseFileByIdApi, empAddCaseReferenceApi, empAddOrUpdateCaseCommentApi, empAddOrUpdateCasePaymentApi, empGetCaseById, empRemoveCaseReferenceApi, empRenameCaseDocFolderApi, empUpdateCaseStatusApi, getCaseCommentsApi, getCaseEmployeeListApi, getEmpCaseDocumentListApi, getEmpCaseProcessListApi } from "../../../../apis/case/empCaseApi"

export default function EmployeeViewCase() {
  const state = useContext(AppContext)
  const { empType, designation } = state?.myAppData?.details
  const param = useParams()

  return (<>
    <ViewCaseComp id={param?._id}
      getCase={empGetCaseById}
      role={"employee"}
      empType={empType}
      viewEmp={"/employee/profile/"}
      attachementUpload={employeeAttachementUpload}
      editUrl={empType?.toLowerCase() === "operation" && "/employee/edit-case/"}
      viewPartner={"/employee/partner details/"}
      viewClient={"/employee/client details/"}
      viewOtherClientCasePath={"/employee/view case/"}
      isViewOtherClientCase={empType?.toLowerCase() === "operation" || empType?.toLowerCase() === "branch" || empType?.toLowerCase() === "finance"}
      addCaseProcess={empUpdateCaseStatusApi}
      addReference={empAddCaseReferenceApi}
      isAddRefence={empType?.toLowerCase() === "operation"}
      isViewProfile={empType?.toLowerCase() === "operation" || empType?.toLowerCase() === "branch" || (empType?.toLowerCase() === "sales" && designation?.toLowerCase() === "manager")}
      // isAddCaseProcess={empType?.toLowerCase()==="operation"}
      isAddCaseProcess={["operation", "sales"].includes(empType?.toLowerCase())}

      deleteReference={empRemoveCaseReferenceApi}

      // comment
      isAddCommit={![].includes(empType?.toLowerCase())}
      canTagComment={["operation", "branch", "finance",]?.includes(empType?.toLowerCase())}
      privateCommit={empType?.toLowerCase() === "operation"}
      addCaseCommit={empAddOrUpdateCaseCommentApi}
      getCaseCommentsApi={getCaseCommentsApi}
      getCaseEmployeeListApi={getCaseEmployeeListApi}
      // comment


      accessPayment={empType?.toLowerCase() === "operation"}
      paymentDetailsApi={empAddOrUpdateCasePaymentApi}
      isCaseFormAccess={empType?.toLowerCase() === "operation"}
      createOrUpdateCaseFormApi={empCreateOrUpdateCaseFormApi}
      caseFormDetailApi={empGetCaseFormById}
      isCaseProcess={!["advocate", "surveyor", "doctor"].includes(empType?.toLowerCase())}
      isPaymentAccess={["operation", "branch", "finance"].includes(empType?.toLowerCase())}
      isCaseFromAccess={!["advocate", "surveyor", "doctor"].includes(empType?.toLowerCase())}

      // case documents
      isRenameDocFolder={empType?.toLowerCase() === "operation"}
      getCaseDocumentApi={getEmpCaseDocumentListApi}
      renameDocFolder={empRenameCaseDocFolderApi}
      addCaseDoc={empAddCaseFileByIdApi}
      deleteDoc={() => { }}
      // case documents


      // case process
      getCaseProcessListApi={getEmpCaseProcessListApi}
    // case process


    />
  </>)
}