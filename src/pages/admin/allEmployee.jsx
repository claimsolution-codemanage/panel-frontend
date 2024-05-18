import { adminSetEmployeeStatus,adminGetAllEmployee,adminDeleteEmployeeById,adminUpdateEmployeeById } from "../../apis"
import AllEmployee from "../../components/Reuse/AllEmployee";

export default function AllAdminEmployee() {
  return (<>
 <AllEmployee
 role={"admin"}
 caseUrl={"/admin/view-employee-case-report/"}
 partnerUrl={"/admin/view-employee-partner-report/"}
 viewSathiUrl={"/admin/view-sathi/"}
  isedit={true}
  getEmployee={adminGetAllEmployee}
  isTrash={false}
  isActive={adminSetEmployeeStatus}
  deleteEmployeeId={adminDeleteEmployeeById}
  updateEmployee={adminUpdateEmployeeById}
 />
  </>)
}