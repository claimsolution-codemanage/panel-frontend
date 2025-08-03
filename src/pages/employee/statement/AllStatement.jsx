import React, { useContext } from 'react'
import Statement from '../../../components/Reuse/Statement'
import { empAllStatementDownload, empFindCaseByFileNoApi, empOperationStatementUpdateApi, empOpStatments } from '../../../apis'
import { AppContext } from '../../../App'

export default function AllStatement() {
    const state = useContext(AppContext)
    const empType = state?.myAppData?.details?.empType

    return (
        <div>
            <Statement
                getStatementApi={empOpStatments}
                excelDownloadApi={empAllStatementDownload}
                fileDetailApi={empFindCaseByFileNoApi}
                statementStatusUpdateApi={empOperationStatementUpdateApi}
                paidAccess={empType?.toLowerCase() === "operation"}
                type={"operation"} />
        </div>
    )
}
