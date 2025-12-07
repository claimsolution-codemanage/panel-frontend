import { employeeChangeCaseStatus, salesAllCaseDownload,employeeAllCase } from "../../../apis"
import { AppContext } from "../../../App"
import { useContext } from "react"
import ViewAllCaseComp from "../../../components/Reuse/ViewAllCaseComp"
import { useParams } from "react-router-dom"
import { employeeAttachementUpload } from "../../../apis/upload"

export default function EmployeeClosedCasePage() {
    const state = useContext(AppContext)
    const param = useParams()
    const empType = state?.myAppData?.details?.empType

    return (<>
        <ViewAllCaseComp
            pageTxt={"Closed Case"}
            isBack={param?._id ? true : false}
            getCases={employeeAllCase}
            empId={param?._id ? param?._id : false}
            downloadCase={salesAllCaseDownload}
            role={"employee"}
            setStatus={employeeChangeCaseStatus}
            setCaseStatus={() => { }}
            viewUrl={"/employee/view case/"}
            isChangeStatus={false}
            isRemoveCase={false}
            isDownload={true}
            attachementUpload={employeeAttachementUpload}
            isClosed={true}
        />
    </>)
}