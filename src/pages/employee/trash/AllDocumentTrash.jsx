import React, { useContext } from 'react'
import CaseDocTrash from '../../../components/Reuse/CaseDocTrash'
import { empAllCaseDoc, empSetCaseDocIsActive } from '../../../apis'
import { empDeleteCaseDocById } from '../../../apis/case/empCaseApi'
import { AppContext } from '../../../App'

export default function EmpAllDocumentTrash() {
  const state = useContext(AppContext)
  const empType = state?.myAppData?.details?.empType
  return (
    <div>
      <CaseDocTrash
        getAllDoc={empAllCaseDoc}
        isActive={empSetCaseDocIsActive}
        deleteDoc={empDeleteCaseDocById}
        isTrash={true}
        isDelete={empType?.toLowerCase() == "operation"}
        role={"employee"}
      />
    </div>
  )
}
