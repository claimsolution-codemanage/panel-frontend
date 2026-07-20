import React from 'react'
import CaseDocTrash from '../../../components/Reuse/CaseDocTrash'
import { adminSetCaseDocIsActive, allAdminCaseDoc } from '../../../apis'
import { adminDeleteCaseDocByIdApi } from '../../../apis/case/adminCaseApi'

export default function AdminCaseDocTrash() {
  return (
    <CaseDocTrash
      getAllDoc={allAdminCaseDoc}
      isActive={adminSetCaseDocIsActive}
      deleteDoc={adminDeleteCaseDocByIdApi}
      isTrash={true}
      isDelete={true}
      role={"admin"}
    />
  )
}
