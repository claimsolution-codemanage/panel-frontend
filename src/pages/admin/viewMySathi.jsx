import { adminSetEmployeeStatus,adminGetAllEmployee,adminDeleteEmployeeById,adminUpdateEmployeeById,adminEmpGetSathiEmployee,
    adminEmpDownloadSathi
 } from "../../apis"
import AllEmployee from "../../components/Reuse/AllEmployee";
import { useParams } from "react-router-dom";

export default function AdminViewMySathi() {
    const param = useParams()
  return (<>
{param?._id && 
 <AllEmployee
 isBack={true}
 empId={param?._id}
 page={"Sathi Team"}
 role={"admin"}
 isDownload={true}
 getDownload={adminEmpDownloadSathi}
 caseUrl={"/admin/view-employee-case-report/"}
 partnerUrl={"/admin/view-employee-partner-report/"}
  isedit={true}
  getEmployee={adminEmpGetSathiEmployee}
  isTrash={false}
  isActive={adminSetEmployeeStatus}
  deleteEmployeeId={adminDeleteEmployeeById}
  updateEmployee={adminUpdateEmployeeById}
 />
 }
  </>)
}