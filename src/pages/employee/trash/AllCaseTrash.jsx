import React from 'react'
import AllCaseTrash from '../../../components/Common/trash/AllCaseTrash'
import { employeeAllCase, empSetCaseIsActiveApi } from '../../../apis'

export default function EmpAllCaseTrash() {
  return (
    <div>
      <AllCaseTrash
        allCaseApi={employeeAllCase}
        caseStatusApi={empSetCaseIsActiveApi}
        deleteCaseApi={() => { }}
        removeCasePermission={false}
        viewCasepath={"/employee/view case"}
      />
    </div>
  )
}
