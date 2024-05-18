import EmployeeTemplate from "../template/employeeTemplate"
import PanelTemplate from "../template/PanelTemplate"
import { Route } from "react-router-dom"


// for employee routes
import EmployeeDasboard from '../pages/employee/dashboard'
import EmployeeSignIn from '../pages/employee/signin'
import EmployeeForgetPassword from '../pages/employee/forgetPassword'
import EmployeeAllCase from '../pages/employee/allCase'
import EmployeeViewCase from '../pages/employee/viewCase'
import EmployeeAllClient from '../pages/employee/allClient'
import EmployeeClientDetails from '../pages/employee/viewClient'
import EmployeeAllPartner from '../pages/employee/allPartner'
import EmployeePartnerDetails from '../pages/employee/viewPartner'
import EmployeeResetPassword from '../pages/employee/resetPassword'
import EmployeeCreateInvoice from '../pages/employee/finance/pages/CreateInvoice'
import EmployeeAllInvoices from '../pages/employee/finance/pages/AllInvoices'
import EmployeeViewInvoice from '../pages/employee/finance/pages/ViewInvoice'
import EmployeeResetForgetPassword from '../pages/employee/resetForgetPassword'
import EmployeeEditInvoice from '../pages/employee/finance/pages/editInvoice'
import EmployeeEditCase from '../pages/employee/editCase'
import EmployeeEditClient from '../pages/employee/editClient'
import EmployeeEditPartner from '../pages/employee/editPartner'
import EmpSaleNewCase from '../pages/employee/sales/addCase'
import EmployeeInvoiceTrash from '../pages/employee/finance/pages/InvoiceTrash'
import EmpSalePartnerReport from "../pages/employee/sales/partnerReport"
import EmpBranchTeam from "../pages/employee/branchTeam"
import EmpViewProfile from "../pages/employee/viewProfile"
import EmployeeAddSathiAcc from "../pages/employee/createSathiAcc"
import EmpViewMySathi from "../pages/employee/viewMySathi"

// for sale employee
import EmployeeAddPartner from '../pages/employee/sales/addPartner'

export const employeeRoutes = [
    <Route path='/employee/signin' element={<PanelTemplate><EmployeeSignIn/></PanelTemplate>}/>,
  <Route path='/employee/forget password' element={<PanelTemplate><EmployeeForgetPassword/></PanelTemplate>}/>,
  <Route path='/employee/dashboard' element={<EmployeeTemplate><EmployeeDasboard/></EmployeeTemplate>}/>,
  <Route path='/employee/reset password' element={<EmployeeTemplate><EmployeeResetPassword/></EmployeeTemplate>}/>,
  <Route path='/employee/profile' element={<EmployeeTemplate><EmpViewProfile/></EmployeeTemplate>}/>,
  <Route path='/employee/profile/:_id' element={<EmployeeTemplate><EmpViewProfile/></EmployeeTemplate>}/>,
  <Route path='/employee/all case' element={<EmployeeTemplate><EmployeeAllCase/></EmployeeTemplate>}/>,
  <Route path='/employee/all case/:_id' element={<EmployeeTemplate><EmployeeAllCase/></EmployeeTemplate>}/>,
  <Route path='/employee/view case/:_id' element={<EmployeeTemplate><EmployeeViewCase/></EmployeeTemplate>}/>,
  <Route path='/employee/all partner' element={<EmployeeTemplate><EmployeeAllPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/all partner/:_id' element={<EmployeeTemplate><EmployeeAllPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/partner details/:_id' element={<EmployeeTemplate><EmployeePartnerDetails/></EmployeeTemplate>}/>,
  <Route path='/employee/all client' element={<EmployeeTemplate><EmployeeAllClient/></EmployeeTemplate>}/>,
  <Route path='/employee/client details/:_id' element={<EmployeeTemplate><EmployeeClientDetails/></EmployeeTemplate>}/>,
  <Route path='/employee/create-invoice/:clientId/:caseId' element={<EmployeeTemplate><EmployeeCreateInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/view-invoice/:_id' element={<EmployeeTemplate><EmployeeViewInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/all-invoices' element={<EmployeeTemplate><EmployeeAllInvoices/></EmployeeTemplate>}/>,
  <Route path='/employee/resetPassword/:verifyToken' sensitive={true} strict={false} element={<PanelTemplate><EmployeeResetForgetPassword/></PanelTemplate>}/>,
  <Route path='/employee/edit-invoice/:_id'  element={<EmployeeTemplate><EmployeeEditInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/edit-case/:_id'  element={<EmployeeTemplate><EmployeeEditCase/></EmployeeTemplate>}/>,
  <Route path='/employee/edit-client/:_id'  element={<EmployeeTemplate><EmployeeEditClient/></EmployeeTemplate>}/>,
  <Route path='/employee/edit-partner/:_id'  element={<EmployeeTemplate><EmployeeEditPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/add-partner'  element={<EmployeeTemplate><EmployeeAddPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/add-case'  element={<EmployeeTemplate><EmpSaleNewCase/></EmployeeTemplate>}/>,
  <Route path='/employee/partner-report/:_id'  element={<EmployeeTemplate><EmpSalePartnerReport/></EmployeeTemplate>}/>,
  <Route path='/employee/branch-team'  element={<EmployeeTemplate><EmpBranchTeam/></EmployeeTemplate>}/>,
  <Route path='/employee/add-sathi-team'  element={<EmployeeTemplate><EmployeeAddSathiAcc/></EmployeeTemplate>}/>,
  <Route path='/employee/view-sathi/:_id'  element={<EmployeeTemplate><EmpViewMySathi/></EmployeeTemplate>}/>,


]
{/* <Route path='/employee/all-trash-invoice'  element={<EmployeeTemplate><EmployeeInvoiceTrash/></EmployeeTemplate>}/> */}