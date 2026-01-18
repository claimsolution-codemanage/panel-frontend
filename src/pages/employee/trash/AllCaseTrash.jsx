import React, { useContext } from 'react'
import AllCaseTrash from '../../../components/Common/trash/AllCaseTrash'
import { empAllCaseApi, empChangeCaseIsActiveApi, empDeleteCaseById } from '../../../apis/case/empCaseApi'
import { AppContext } from '../../../App'

export default function EmpAllCaseTrash() {
    const state = useContext(AppContext)
    const empType = state?.myAppData?.details?.empType
  return (
    <div>
      <AllCaseTrash
        allCaseApi={empAllCaseApi}
        caseStatusApi={empChangeCaseIsActiveApi}
        deleteCaseApi={empDeleteCaseById}
        removeCasePermission={empType?.toLowerCase()=="operation"}
        viewCasepath={"/employee/view case"}
      />
    </div>
  )
}
