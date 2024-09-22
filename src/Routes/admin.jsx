import AdminTemplate from "../template/adminTemplate"
import PanelTemplate from "../template/PanelTemplate"
import {Route} from 'react-router-dom'
import { adminAllStatment,adminStatements } from "../apis";


// for admin routes
import AdminSignIn from '../pages/admin/signin';
import AdminSignUp from '../pages/admin/signup'
import AdminDashboard from '../pages/admin/dashboard'
import AdminAccountSetting from '../pages/admin/accountSetting'
import AdminCreateNewEmployee from '../pages/admin/createEmployee'
import AllAdminCase from '../pages/admin/allcases'
import AdminViewCase from '../pages/admin/viewcase'
import AllAdminPartner from '../pages/admin/allPartner'
import AllAdminClient from '../pages/admin/allClient'
import AllAdminEmployee from '../pages/admin/allEmployee'
import AdminPartnerDetails from '../pages/admin/partnerDetails'
import AdminClientDetails from '../pages/admin/viewClient'
import AdminAllJobs from '../pages/admin/jobs'
import AdminEditCase from '../pages/admin/editCase'
import AdminAllComplaint from '../pages/admin/allComplaints'
import AdminTrashPartner from '../pages/admin/PartnerTrash'
import AdminTrashClient from '../pages/admin/ClientTrash'
import AdminTrashCase from '../pages/admin/CaseTrash'
import AdminForgetPassword from '../pages/admin/forgetPassword'
import AdminResetForgetPassword from '../pages/admin/resetForgetPassword'
import MyAdmins from '../pages/admin/SuperAdmin/MyAdmins'
import AdminViewPartnerReport from '../pages/admin/partnerReport'
import AdminEditClient from '../pages/admin/editClient'
import AdminEditPartner from '../pages/admin/editParnter'
import AdminViewSaleEmpCaseReport from '../pages/admin/saleEmpCaseReport'
import AdminSaleEmpPartnerReport from '../pages/admin/saleEmpPartnerReport'
import AdminCreateInvoice from "../pages/admin/createInvoice";
import AdminAllInvoice from "../pages/admin/allInvoice";
import AdminViewInvoice from "../pages/admin/viewInvoice";
import AdminEditInvoice from "../pages/admin/editInvoice";
import AdminInvoiceTrash from "../pages/admin/InvoiceTrash";
import AdminCaseDocTrash from "../pages/admin/caseDocTrash";
import AdminEmployeeTrash from "../pages/admin/EmployeeTrash";
import AdminViewEmployee from "../pages/admin/ViewEmployee";
import AdminViewMySathi from "../pages/admin/viewMySathi";
import AdminRejectCase from '../pages/admin/allRejectCase'
import ViewAllStatement from "../components/Reuse/ViewAllStatement";
import AdminAddInvoice from "../pages/admin/addInvoice";
import Statement from "../components/Reuse/Statement";

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
  <Route path='/admin/statement/partner/:partnerId'  element={<AdminTemplate><ViewAllStatement getStatementApi={adminAllStatment} type={"admin"}/></AdminTemplate>}/>,
  <Route path='/admin/statement/employee/:empId'  element={<AdminTemplate><ViewAllStatement getStatementApi={adminAllStatment} type={"admin"}/></AdminTemplate>}/>,
  <Route path='/admin/statement'  element={<AdminTemplate><Statement getStatementApi={adminStatements} type={"admin"}/></AdminTemplate>}/>,


]