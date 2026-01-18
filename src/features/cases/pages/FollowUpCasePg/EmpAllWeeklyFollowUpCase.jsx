import {  salesAllCaseDownload} from "../../../../apis"
import { AppContext } from "../../../../App"
import { useContext } from "react"
import ViewAllCaseComp from "../../components/viewAllComp/ViewAllCaseComp"
import { useParams } from "react-router-dom"
import { empAllCaseApi, empUpdateCaseStatusApi } from "../../../../apis/case/empCaseApi"

export default function EmpCaseWeeklyFollowUpPage() {
    const state = useContext(AppContext)
    const param = useParams()
    const empType = state?.myAppData?.details?.empType

    return (<>
        <ViewAllCaseComp
            pageTxt={"Weekly Follow-Up"}
            isBack={param?._id ? true : false}
            getCases={empAllCaseApi}
            empId={param?._id ? param?._id : false}
            downloadCase={salesAllCaseDownload}
            role={"employee"}
            setStatus={empUpdateCaseStatusApi}
            setCaseStatus={() => { }}
            viewUrl={"/employee/view case/"}
            isChangeStatus={empType?.toLowerCase()==="operation"}
            isRemoveCase={false}
            isDownload={true}
            isClosed={false}
            isWeeklyFollowUp={true}
        />
    </>)
}