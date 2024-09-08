import { adminSetEmployeeStatus,adminGetAllEmployee,adminDeleteEmployeeById,adminUpdateEmployeeById,adminDownloadAllEmp } from "../../apis"
import AllEmployee from "../../components/Reuse/AllEmployee";

export default function AllAdminEmployee() {
  return (<>
 <AllEmployee
 page={"All Employee"}
 isBack={false}
 role={"admin"}
 caseUrl={"/admin/view-employee-case-report/"}
 partnerUrl={"/admin/view-employee-partner-report/"}
 viewSathiUrl={"/admin/view-sathi/"}
  isedit={true}
  getEmployee={adminGetAllEmployee}
  isTrash={false}
  isDownload={true}
  getDownload={adminDownloadAllEmp}
  isActive={adminSetEmployeeStatus}
  deleteEmployeeId={adminDeleteEmployeeById}
  updateEmployee={adminUpdateEmployeeById}
  statement={true}
  statementUrl={"/admin/statement/employee"}
 />
  </>)
}