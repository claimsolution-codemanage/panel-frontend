import { adminSetEmployeeStatus,adminGetAllEmployee,adminDeleteEmployeeById,adminUpdateEmployeeById } from "../../apis"
import AllEmployee from "../../components/Reuse/AllEmployee";

export default function AllAdminEmployee() {
  return (<>
 <AllEmployee
  getEmployee={adminGetAllEmployee}
  isTrash={false}
  isActive={adminSetEmployeeStatus}
  deleteEmployeeId={adminDeleteEmployeeById}
  updateEmployee={adminUpdateEmployeeById}
 />
  </>)
}