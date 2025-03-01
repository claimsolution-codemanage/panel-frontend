import AdminTemplate from "../template/adminTemplate"
import PanelTemplate from "../template/PanelTemplate"
import {Route} from 'react-router-dom'
import { adminAllStatementDownload, adminAllStatment,adminFindCaseByFileNoApi,adminStatements } from "../apis";


// for admin routes
import AdminSignIn from "../pages/admin/setting/signin";
import AdminSignUp from "../pages/admin/setting/signup";
import AdminDashboard from '../pages/admin/other/dashboard'
import AdminAccountSetting from '../pages/admin/setting/accountSetting'
import AdminCreateNewEmployee from '../pages/admin/empoyee/createEmployee'
import AllAdminCase from '../pages/admin/case/allcases'
import AdminViewCase from '../pages/admin/case/viewcase'
import AllAdminPartner from '../pages/admin/partner/allPartner'
import AllAdminClient from '../pages/admin/client/allClient'
import AllAdminEmployee from '../pages/admin/empoyee/allEmployee'
import AdminPartnerDetails from '../pages/admin/partner/partnerDetails'
import AdminClientDetails from '../pages/admin/client/viewClient'
import AdminAllJobs from '../pages/admin/other/jobs'
import AdminEditCase from '../pages/admin/case/editCase'
import AdminAllComplaint from '../pages/admin/other/allComplaints'
import AdminTrashPartner from '../pages/admin/partner/PartnerTrash'
import AdminTrashClient from '../pages/admin/client/ClientTrash'
import AdminTrashCase from '../pages/admin/case/CaseTrash'
import AdminForgetPassword from '../pages/admin/setting/forgetPassword'
import AdminResetForgetPassword from '../pages/admin/setting/resetForgetPassword'
import MyAdmins from '../pages/admin/SuperAdmin/MyAdmins'
import AdminViewPartnerReport from '../pages/admin/partner/partnerReport'
import AdminEditClient from '../pages/admin/client/editClient'
import AdminEditPartner from '../pages/admin/partner/editParnter'
import AdminViewSaleEmpCaseReport from '../pages/admin/empoyee/saleEmpCaseReport'
import AdminSaleEmpPartnerReport from '../pages/admin/empoyee/saleEmpPartnerReport'
import AdminCreateInvoice from "../pages/admin/invoice/createInvoice";
import AdminAllInvoice from "../pages/admin/invoice/allInvoice";
import AdminViewInvoice from "../pages/admin/invoice/viewInvoice";
import AdminEditInvoice from "../pages/admin/invoice/editInvoice";
import AdminInvoiceTrash from "../pages/admin/invoice/InvoiceTrash";
import AdminCaseDocTrash from "../pages/admin/case/caseDocTrash";
import AdminEmployeeTrash from "../pages/admin/empoyee/EmployeeTrash";
import AdminViewEmployee from "../pages/admin/empoyee/ViewEmployee";
import AdminViewMySathi from "../pages/admin/empoyee/viewMySathi";
import AdminRejectCase from '../pages/admin/case/allRejectCase'
import ViewAllStatement from "../components/Reuse/ViewAllStatement";
import AdminAddInvoice from "../pages/admin/invoice/addInvoice";
import Statement from "../components/Reuse/Statement";
import AdminNotification from "../pages/admin/other/allNotification";
import AdminEditEmployee from "../pages/admin/empoyee/EditEmployee";
import JoiningFormComp from "../pages/admin/empoyee/JoiningForm";

{/* for admin */}
export const adminRoutes = [
  <Route path='/admin/signin' element={<PanelTemplate><AdminSignIn/></PanelTemplate>}/>,
  <Route path='/admin/signup' element={<PanelTemplate><AdminSignUp/></PanelTemplate>}/>,
  <Route path='/admin/forget password' element={<PanelTemplate><AdminForgetPassword/></PanelTemplate>}/>,
  <Route path='/admin/resetPassword/:verifyToken' sensitive={true} strict={false} element={<PanelTemplate><AdminResetForgetPassword/></PanelTemplate>}/>,
  <Route path='/admin/dashboard' element={<AdminTemplate><AdminDashboard/></AdminTemplate>}/>,
  <Route path='/admin/account setting' element={<AdminTemplate><AdminAccountSetting/></AdminTemplate>}/>,
  <Route path='/admin/add new employee' element={<AdminTemplate><AdminCreateNewEmployee/></AdminTemplate>}/>,
  <Route path='/admin/all case' element={<AdminTemplate><AllAdminCase/></AdminTemplate>}/>,
  <Route path='/admin/view case/:_id' element={<AdminTemplate><AdminViewCase/></AdminTemplate>}/>,
  <Route path='/admin/all partner' element={<AdminTemplate><AllAdminPartner/></AdminTemplate>}/>,
  <Route path='/admin/partner details/:_id' element={<AdminTemplate><AdminPartnerDetails/></AdminTemplate>}/>,
  <Route path='/admin/all client' element={<AdminTemplate><AllAdminClient/></AdminTemplate>}/>,
  <Route path='/admin/client details/:_id' element={<AdminTemplate><AdminClientDetails/></AdminTemplate>}/>,
  <Route path='/admin/edit case/:_id' element={<AdminTemplate><AdminEditCase/></AdminTemplate>}/>,
  <Route path='/admin/all employee' element={<AdminTemplate><AllAdminEmployee/></AdminTemplate>}/>,
  <Route path='/admin/all job' element={<AdminTemplate><AdminAllJobs/></AdminTemplate>}/>,
  <Route path='/admin/all complaint' element={<AdminTemplate><AdminAllComplaint/></AdminTemplate>}/>,
  <Route path='/admin/my-admins' element={<AdminTemplate><MyAdmins/></AdminTemplate>}/>,
  <Route path='/admin/view-partner-report/:_id' element={<AdminTemplate><AdminViewPartnerReport/></AdminTemplate>}/>,
  <Route path='/admin/edit-client/:_id'  element={<AdminTemplate><AdminEditClient/></AdminTemplate>}/>,
  <Route path='/admin/edit-partner/:_id'  element={<AdminTemplate><AdminEditPartner/></AdminTemplate>}/>,
  <Route path='/admin/employee/profile/:_id'  element={<AdminTemplate><AdminViewEmployee/></AdminTemplate>}/>,
  <Route path='/admin/employee/edit/:_id'  element={<AdminTemplate><AdminEditEmployee/></AdminTemplate>}/>,
  <Route path='/admin/employee/joinin-form/:_id'  element={<AdminTemplate><JoiningFormComp/></AdminTemplate>}/>,
  <Route path='/admin/view-employee-case-report/:_id'  element={<AdminTemplate><AdminViewSaleEmpCaseReport/></AdminTemplate>}/>,
  <Route path='/admin/view-employee-partner-report/:_id'  element={<AdminTemplate><AdminSaleEmpPartnerReport/></AdminTemplate>}/>,
  <Route path='/admin/create-invoice/:clientId/:caseId'  element={<AdminTemplate><AdminCreateInvoice/></AdminTemplate>}/>,
  <Route path='/admin/add-invoice'  element={<AdminTemplate><AdminAddInvoice/></AdminTemplate>}/>,
  <Route path='/admin/all-invoices'  element={<AdminTemplate><AdminAllInvoice/></AdminTemplate>}/>,
  <Route path='/admin/view-invoice/:_id'  element={<AdminTemplate><AdminViewInvoice/></AdminTemplate>}/>,
  <Route path='/admin/edit-invoice/:_id'  element={<AdminTemplate><AdminEditInvoice/></AdminTemplate>}/>,
  <Route path='/admin/all trash partner' element={<AdminTemplate><AdminTrashPartner/></AdminTemplate>}/>,
  <Route path='/admin/all trash client' element={<AdminTemplate><AdminTrashClient/></AdminTemplate>}/>,
  <Route path='/admin/all trash case' element={<AdminTemplate><AdminTrashCase/></AdminTemplate>}/>,
  <Route path='/admin/all-trash-invoice'  element={<AdminTemplate><AdminInvoiceTrash/></AdminTemplate>}/>,
  <Route path='/admin/all-trash-doc'  element={<AdminTemplate><AdminCaseDocTrash/></AdminTemplate>}/>,
  <Route path='/admin/all-trash-employee'  element={<AdminTemplate><AdminEmployeeTrash/></AdminTemplate>}/>,
  <Route path='/admin/view-sathi/:_id'  element={<AdminTemplate><AdminViewMySathi/></AdminTemplate>}/>,
  <Route path='/admin/reject-cases'  element={<AdminTemplate><AdminRejectCase/></AdminTemplate>}/>,
  <Route path='/admin/statement/partner/:partnerId'  element={<AdminTemplate><ViewAllStatement getStatementApi={adminAllStatment} excelDownloadApi={adminAllStatementDownload} fileDetailApi={adminFindCaseByFileNoApi} type={"admin"}/></AdminTemplate>}/>,
  <Route path='/admin/statement/employee/:empId'  element={<AdminTemplate><ViewAllStatement getStatementApi={adminAllStatment} excelDownloadApi={adminAllStatementDownload} fileDetailApi={adminFindCaseByFileNoApi} type={"admin"}/></AdminTemplate>}/>,
  <Route path='/admin/statement'  element={<AdminTemplate><Statement getStatementApi={adminStatements} excelDownloadApi={adminAllStatementDownload} fileDetailApi={adminFindCaseByFileNoApi} type={"admin"}/></AdminTemplate>}/>,
  <Route path='/admin/notification'  element={<AdminTemplate><AdminNotification/></AdminTemplate>}/>,

]