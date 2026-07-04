import React, { useContext } from 'react'
import Statement from '../../../components/Reuse/Statement'
import { AppContext } from '../../../App'
import { empFindCaseByFileNoApi } from '../../../apis/case/empCaseApi'
import { empAllStatementDownloadApi, empDeleteStatementApi, empStatementApi, empStatementUpdateApi } from '../../../apis/statement/empStatementApi'

export default function AllStatement() {
    const state = useContext(AppContext)
    const empType = state?.myAppData?.details?.empType

    return (
        <div>
            <Statement
                getStatementApi={empStatementApi}
                excelDownloadApi={empAllStatementDownloadApi}
                fileDetailApi={empFindCaseByFileNoApi}
                statementStatusUpdateApi={empStatementUpdateApi}
                paidAccess={empType?.toLowerCase() === "operation"}
                type={"operation"}
                deleteStatementApi={empDeleteStatementApi}
                deleteStatementAccess={empType?.toLowerCase() === "operation"}
            />
        </div>
    )
}
