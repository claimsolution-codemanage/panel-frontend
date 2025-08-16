import React from 'react'
import CaseDocTrash from '../../../components/Reuse/CaseDocTrash'
import { empAllCaseDoc, empSetCaseDocIsActive } from '../../../apis'

export default function EmpAllDocumentTrash() {
  return (
    <div>
          <CaseDocTrash
          getAllDoc={empAllCaseDoc}
          isActive={empSetCaseDocIsActive}
          deleteDoc={()=>{}}
          isTrash={true}
          isDelete={false}
          role={"employee"}
          />
    </div>
  )
}
