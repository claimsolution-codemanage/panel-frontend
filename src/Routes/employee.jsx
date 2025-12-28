import EmployeeTemplate from "../template/employeeTemplate"
import PanelTemplate from "../template/PanelTemplate"
import { Route } from "react-router-dom"
import { empAllStatementDownload, empFindCaseByFileNoApi, empOpAllStatment, empOpStatments } from "../apis"


// for employee routes
import EmployeeDasboard from '../pages/employee/setting/dashboard'
import EmployeeSignIn from '../pages/employee/setting/signin'
import EmployeeForgetPassword from '../pages/employee/setting/forgetPassword'
import EmployeeAllClient from '../pages/employee/client/allClient'
import EmployeeClientDetails from '../pages/employee/client/viewClient'
import EmployeeAllPartner from '../pages/employee/allPartner'
import EmployeePartnerDetails from '../pages/employee/viewPartner'
import EmployeeResetPassword from '../pages/employee/setting/resetPassword'
import EmployeeCreateInvoice from '../pages/employee/finance/pages/CreateInvoice'
import EmployeeAllInvoices from '../pages/employee/finance/pages/AllInvoices'
import EmployeeViewInvoice from '../pages/employee/finance/pages/ViewInvoice'
import EmployeeResetForgetPassword from '../pages/employee/setting/resetForgetPassword'
import EmployeeEditInvoice from '../pages/employee/finance/pages/editInvoice'
import EmployeeEditClient from '../pages/employee/client/editClient'
import EmployeeEditPartner from '../pages/employee/editPartner'
import EmployeeInvoiceTrash from '../pages/employee/finance/pages/InvoiceTrash'
import EmpSalePartnerReport from "../pages/employee/sales/partnerReport"
import EmpBranchTeam from "../pages/employee/branchTeam"
import EmpViewProfile from "../pages/employee/viewProfile"
import EmployeeAddSathiAcc from "../pages/employee/createSathiAcc"
import EmpViewMySathi from "../pages/employee/viewMySathi"
import EmployeeAddInvoice from "../pages/employee/finance/pages/addInvoice"
import EmpNotification from "../pages/employee/setting/allNotification"

// for sale employee
import EmployeeAddPartner from '../pages/employee/sales/addPartner'
import ViewAllStatement from "../components/Reuse/ViewAllStatement"
import Statement from "../components/Reuse/Statement"
import EmployeeRejectCase from "../features/cases/pages/rejectCasePg/EmpAllRejectCase"
import AllStatement from "../pages/employee/statement/AllStatement"
import EmpAllPartnersTrash from "../pages/employee/trash/AllPartnersTrash"
import EmpAllCaseTrash from "../pages/employee/trash/AllCaseTrash"
import EmpAllClientTrash from "../pages/employee/trash/AllClientTrash"
import EmpAllInvoiceTrash from "../pages/employee/trash/AllInvoiceTrash"
import EmpAllDocumentTrash from "../pages/employee/trash/AllDocumentTrash"
import EmpAllEmployeeTrash from "../pages/employee/trash/AllEmployeeTrash"

import EmpSaleNewCase from '../features/cases/pages/addCasePg/EmpAddCase'
import EmployeeEditCase from '../features/cases/pages/editCasePg/EmpEditCase'
import EmployeeClosedCasePage from "../features/cases/pages/closedCasePg/EmpAllClosedCase"
import EmpCaseWeeklyFollowUpPage from "../features/cases/pages/FollowUpCasePg/EmpAllWeeklyFollowUpCase"
import EmployeeAllCase from '../features/cases/pages/viewAllPg/EmpAllCase'
import EmployeeViewCase from '../features/cases/pages/viewCasePg/EmpViewCase'

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
  <Route path='/employee/edit-case/:_id'  element={<EmployeeTemplate><EmployeeEditCase/></EmployeeTemplate>}/>,
  <Route path='/employee/reject-cases'  element={<EmployeeTemplate><EmployeeRejectCase/></EmployeeTemplate>}/>,
  <Route path='/employee/closed-cases'  element={<EmployeeTemplate><EmployeeClosedCasePage/></EmployeeTemplate>}/>,
  <Route path='/employee/case-weekly-followUp'  element={<EmployeeTemplate><EmpCaseWeeklyFollowUpPage/></EmployeeTemplate>}/>,

  <Route path='/employee/all partner' element={<EmployeeTemplate><EmployeeAllPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/all partner/:_id' element={<EmployeeTemplate><EmployeeAllPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/partner details/:_id' element={<EmployeeTemplate><EmployeePartnerDetails/></EmployeeTemplate>}/>,
  <Route path='/employee/all client' element={<EmployeeTemplate><EmployeeAllClient/></EmployeeTemplate>}/>,
  <Route path='/employee/client details/:_id' element={<EmployeeTemplate><EmployeeClientDetails/></EmployeeTemplate>}/>,
  <Route path='/employee/create-invoice/:clientId/:caseId' element={<EmployeeTemplate><EmployeeCreateInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/add-invoice' element={<EmployeeTemplate><EmployeeAddInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/view-invoice/:_id' element={<EmployeeTemplate><EmployeeViewInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/all-invoices' element={<EmployeeTemplate><EmployeeAllInvoices/></EmployeeTemplate>}/>,
  <Route path='/employee/resetPassword/:verifyToken' sensitive={true} strict={false} element={<PanelTemplate><EmployeeResetForgetPassword/></PanelTemplate>}/>,
  <Route path='/employee/edit-invoice/:_id'  element={<EmployeeTemplate><EmployeeEditInvoice/></EmployeeTemplate>}/>,
  <Route path='/employee/edit-client/:_id'  element={<EmployeeTemplate><EmployeeEditClient/></EmployeeTemplate>}/>,
  <Route path='/employee/edit-partner/:_id'  element={<EmployeeTemplate><EmployeeEditPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/add-partner'  element={<EmployeeTemplate><EmployeeAddPartner/></EmployeeTemplate>}/>,
  <Route path='/employee/add-case'  element={<EmployeeTemplate><EmpSaleNewCase/></EmployeeTemplate>}/>,
  <Route path='/employee/partner-report/:_id'  element={<EmployeeTemplate><EmpSalePartnerReport/></EmployeeTemplate>}/>,
  <Route path='/employee/branch-team'  element={<EmployeeTemplate><EmpBranchTeam/></EmployeeTemplate>}/>,
  <Route path='/employee/add-sathi-team'  element={<EmployeeTemplate><EmployeeAddSathiAcc/></EmployeeTemplate>}/>,
  <Route path='/employee/view-sathi/:_id'  element={<EmployeeTemplate><EmpViewMySathi/></EmployeeTemplate>}/>,
  <Route path='/employee/statement/partner/:partnerId'  element={<EmployeeTemplate><ViewAllStatement getStatementApi={empOpAllStatment} excelDownloadApi={empAllStatementDownload} fileDetailApi={empFindCaseByFileNoApi} type={"operation"}/></EmployeeTemplate>}/>,
  <Route path='/employee/statement/employee/:empId'  element={<EmployeeTemplate><ViewAllStatement getStatementApi={empOpAllStatment} excelDownloadApi={empAllStatementDownload} fileDetailApi={empFindCaseByFileNoApi} type={"operation"}/></EmployeeTemplate>}/>,
  <Route path='/employee/statement/sathi-team/:empId'  element={<EmployeeTemplate><ViewAllStatement getStatementApi={empOpAllStatment} excelDownloadApi={empAllStatementDownload} fileDetailApi={empFindCaseByFileNoApi} type={"sathi team"}/></EmployeeTemplate>}/>,
  <Route path='/employee/statement'  element={<EmployeeTemplate><AllStatement/></EmployeeTemplate>}/>,
  <Route path='/employee/notification'  element={<EmployeeTemplate><EmpNotification/></EmployeeTemplate>}/>,

  <Route path='/employee/all-trash-partner' element={<EmployeeTemplate><EmpAllPartnersTrash/></EmployeeTemplate>}/>,
  <Route path='/employee/all-trash-client' element={<EmployeeTemplate><EmpAllClientTrash/></EmployeeTemplate>}/>,
  <Route path='/employee/all-trash-case' element={<EmployeeTemplate><EmpAllCaseTrash/></EmployeeTemplate>}/>,
  <Route path='/employee/all-trash-invoice'  element={<EmployeeTemplate><EmpAllInvoiceTrash/></EmployeeTemplate>}/>,
  <Route path='/employee/all-trash-doc'  element={<EmployeeTemplate><EmpAllDocumentTrash/></EmployeeTemplate>}/>,
  <Route path='/employee/all-trash-employee'  element={<EmployeeTemplate><EmpAllEmployeeTrash/></EmployeeTemplate>}/>,

]
{/* <Route path='/employee/all-trash-invoice'  element={<EmployeeTemplate><EmployeeInvoiceTrash/></EmployeeTemplate>}/> */}