import { adminSetEmployeeStatus,adminGetAllEmployee,adminDeleteEmployeeById,adminUpdateEmployeeById } from "../../../apis"
import AllEmployee from "../../../components/Reuse/AllEmployee";

export default function AdminEmployeeTrash() {
  return (<>
 <AllEmployee
  role={"admin"}
  getEmployee={adminGetAllEmployee}
  isTrash={true}
  isActive={adminSetEmployeeStatus}
  deleteEmployeeId={adminDeleteEmployeeById}
  updateEmployee={adminUpdateEmployeeById}
 />
  </>)
}