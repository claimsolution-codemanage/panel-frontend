import AllClientTrash from '../../../components/Common/trash/AllClientTrash'
import { adminDeleteClientById, adminSetClientStatus, allAdminClient } from '../../../apis'

export default function AdminTrashClient() {
  return (
    <div>
      <AllClientTrash
      allClientApi={allAdminClient}
      clientStatusApi={adminSetClientStatus}
      deleteClientApi={adminDeleteClientById}
      removeClientPermission={true}
      viewClientpath={"/admin/client details"}
      />
    </div>
  )
}
