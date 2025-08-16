import AllPartnerTrash from '../../../components/Common/trash/AllPartnerTrash'
import { adminDeletePartnerById, adminSetPartnerStatus, allAdminPartner } from '../../../apis'

export default function AdminTrashPartner() {
  return (
    <div>
      <AllPartnerTrash
      allPartnerApi={allAdminPartner}
      partnerStatusApi={adminSetPartnerStatus}
      deletePartnerApi={adminDeletePartnerById}
      removePartnerPermission={true}
      viewPartnerpath={"/admin/partner details"}
      />
    </div>
  )
}
