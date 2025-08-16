import AllClientTrash from '../../../components/Common/trash/AllClientTrash'
import { employeeAllClient, empSetClientStatusApi } from '../../../apis'

export default function EmpAllClientTrash() {
  return (
    <div>
            <AllClientTrash
            allClientApi={employeeAllClient}
            clientStatusApi={empSetClientStatusApi}
            deleteClientApi={()=>{}}
            removeClientPermission={false}
            viewClientpath={"/employee/client details"}
            />
    </div>
  )
}
