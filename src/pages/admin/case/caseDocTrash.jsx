import React from 'react'
import CaseDocTrash from '../../../components/Reuse/CaseDocTrash'
import { adminSetCaseDocIsActive,allAdminCaseDoc,adminDeleteCaseDocById } from '../../../apis'

export default function AdminCaseDocTrash() {
  return (
    <CaseDocTrash
    getAllDoc={allAdminCaseDoc}
    isActive={adminSetCaseDocIsActive}
    deleteDoc={adminDeleteCaseDocById}
    isTrash={true}
    isDelete={true}
    role={"admin"}
    />
  )
}
