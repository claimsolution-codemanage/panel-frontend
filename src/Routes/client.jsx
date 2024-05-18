import PanelTemplate from "../template/PanelTemplate"
import ClientTemplate from "../template/clientTemplate"
import { Route } from "react-router-dom"


// for client routes
import ClientAllInvoice from "../pages/client/AllInvoice"
import ClientServiceAgreement from "../pages/client/ClientServiceAgreement"
import ClientAcceptTls from "../pages/client/acceptTls"
import ClientNewCase from "../pages/client/addCase"
import ClientAfterVerification from "../pages/client/afterVerification"
import ClientViewAllCase from "../pages/client/allCase"
import ClientDasboard from "../pages/client/dashboard"
import ClientEditProfile from "../pages/client/editProfile"
import ClientForgetPassword from "../pages/client/forgetPassword"
import ClientOtpVerify from "../pages/client/otpVerify"
import ClientProfile from "../pages/client/profile"
import ClientResetPassword from "../pages/client/resetPassword"
import ClientMobileSendOtp from "../pages/client/sendMobileCode"
import ClientSignUp from "../pages/client/signup"
import ClientViewCase from "../pages/client/viewCase"
import ClientViewInvoice from "../pages/client/viewInvoice"
import ClientViewTLS from "../pages/client/viewTls"
import AcceptClientRequest from "../pages/client/acceptClientRequest"
import ClientSignIn from "../pages/client/signin"


export const clientRoutes = [
<Route path='/client/signin' element={<PanelTemplate><ClientSignIn/></PanelTemplate>}/>,
  <Route path='/client/signup' element={<PanelTemplate><ClientSignUp/></PanelTemplate>}/>,
  <Route path='/client/email otp verify' element={<PanelTemplate><ClientOtpVerify/></PanelTemplate>}/>,
  <Route path='/client/accept-request/:tokenId' element={<PanelTemplate><AcceptClientRequest /></PanelTemplate>} />,
  <Route path='/client/send mobile otp' element={<PanelTemplate><ClientMobileSendOtp/></PanelTemplate>}/>,
  <Route path='/client/forget password' element={<PanelTemplate><ClientForgetPassword/></PanelTemplate>}/>,
  <Route path='/client/verification completed' element={<PanelTemplate><ClientAfterVerification/></PanelTemplate>}/>,
  <Route path='/client/acceptTermsAndConditions/:verifyToken' element={<PanelTemplate><ClientAcceptTls/></PanelTemplate>}/>,
  <Route path='/client/resetPassword/:verifyToken'   sensitive={true} strict={false} element={<PanelTemplate><ClientResetPassword/></PanelTemplate>}/>,
  <Route path='/client/dashboard' element={<ClientTemplate><ClientDasboard/></ClientTemplate>}/>,
  <Route path='/client/profile' element={<ClientTemplate><ClientProfile/></ClientTemplate>}/>,
  <Route path='/client/edit profile/:_id' element={<ClientTemplate><ClientEditProfile/></ClientTemplate>}/>,
  <Route path='/client/add new case' element={<ClientTemplate><ClientNewCase/></ClientTemplate>}/>,
  <Route path='/client/all case' element={<ClientTemplate><ClientViewAllCase/></ClientTemplate>}/>,
  <Route path='/client/view case/:_id' element={<ClientTemplate><ClientViewCase/></ClientTemplate>}/>,
  <Route path='/client/view tls' element={<ClientTemplate><ClientViewTLS/></ClientTemplate>}/>,
  <Route path='/client/view service agreement' element={<ClientTemplate><ClientServiceAgreement/></ClientTemplate>}/>,
  <Route path='/client/view-invoice/:_id' element={<ClientTemplate><ClientViewInvoice/></ClientTemplate>}/>,
  <Route path='/client/all-invoices' element={<ClientTemplate><ClientAllInvoice/></ClientTemplate>}/>,
]
{/* <Route path='/employee/all-trash-invoice'  element={<EmployeeTemplate><EmployeeInvoiceTrash/></EmployeeTemplate>}/> */}
{/* <Route path='/client/edit case/:_id' element={<ClientTemplate><ClientEditCase/></ClientTemplate>}/> */}