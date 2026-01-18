import AllClientTrash from '../../../components/Common/trash/AllClientTrash'
import { employeeAllClient, empSetClientStatusApi } from '../../../apis'
import { empDeleteClientById } from '../../../apis/client/empClientApi'
import { useContext } from 'react'
import { AppContext } from '../../../App'

export default function EmpAllClientTrash() {
  const state = useContext(AppContext)
  const empType = state?.myAppData?.details?.empType
  return (
    <div>
      <AllClientTrash
        allClientApi={employeeAllClient}
        clientStatusApi={empSetClientStatusApi}
        deleteClientApi={empDeleteClientById}
        removeClientPermission={empType?.toLowerCase()=="operation"}
        viewClientpath={"/employee/client details"}
      />
    </div>
  )
}
