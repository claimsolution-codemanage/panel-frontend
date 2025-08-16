import AllPartnerTrash from '../../../components/Common/trash/AllPartnerTrash'
import {  employeeAllPartner, empSetPartnerStatus } from '../../../apis'

export default function EmpAllPartnersTrash() {
  return (
    <div>
      <AllPartnerTrash
      allPartnerApi={employeeAllPartner}
      partnerStatusApi={empSetPartnerStatus}
      deletePartnerApi={()=>{}}
      removePartnerPermission={false}
      viewPartnerpath={"/employee/partner details"}
      />
    </div>
  )
}
