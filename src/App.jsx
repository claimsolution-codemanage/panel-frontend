import {Route,Routes} from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'
import { getToken,getJwtDecode } from './utils/helperFunction'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Error from './pages/Error'
import Health_Insurance from './pages/Services/Health_Insurance'
import Any_Insurance_Claim_Solution from './pages/Services/Any_Insurance_Claim_Solution'
import Death_Claim_Solution from './pages/Services/Death_Claim_Solution'
import Motor_Insurance_Claim_Solution from './pages/Services/Motor_Insurance_Claim_Solution'
// import Navbar from './components/Common/Navabar'
import Blogs from './pages/blogs'
import ViewBlogs from './pages/BlogSection/ViewBlogs'
import Career from './pages/career'
import Patnership from './pages/Patnership'
import Policy from './pages/policy'
import Login from './pages/login'
import Feedback from './pages/Feedback'

import TermsAndCondition from './pages/termsAndConditions'
import PartnerAgreement from './pages/agreements/partner'
import ClientAgreement from './pages/agreements/client'

// for admin routes
import AdminSignIn from './pages/admin/signin';
import AdminSignUp from './pages/admin/signup'
import AdminDashboard from './pages/admin/dashboard'
import AdminAccountSetting from './pages/admin/accountSetting'
import AdminCreateNewEmployee from './pages/admin/createEmployee'
import AllAdminCase from './pages/admin/allcases'
import AdminViewCase from './pages/admin/viewcase'
import AllAdminPartner from './pages/admin/allPartner'
import AllAdminClient from './pages/admin/allClient'
import AllAdminEmployee from './pages/admin/allEmployee'
import AdminPartnerDetails from './pages/admin/partnerDetails'
import AdminClientDetails from './pages/admin/viewClient'
import AdminAllJobs from './pages/admin/jobs'
import AdminEditCase from './pages/admin/editCase'
import AdminAllComplaint from './pages/admin/allComplaints'
import AdminTrashPartner from './pages/admin/PartnerTrash'
import AdminTrashClient from './pages/admin/ClientTrash'
import AdminTrashCase from './pages/admin/CaseTrash'
import AdminForgetPassword from './pages/admin/forgetPassword'
import AdminResetForgetPassword from './pages/admin/resetForgetPassword'
import MyAdmins from './pages/admin/SuperAdmin/MyAdmins'
import AdminViewPartnerReport from './pages/admin/partnerReport'
import PaymentRoot from './pages/payment/PaymentRoot'




// for employee routes
import EmployeeDasboard from './pages/employee/dashboard'
import EmployeeSignIn from './pages/employee/signin'
import EmployeeForgetPassword from './pages/employee/forgetPassword'
import EmployeeAllCase from './pages/employee/allCase'
import EmployeeViewCase from './pages/employee/viewCase'
import EmployeeAllClient from './pages/employee/allClient'
import EmployeeClientDetails from './pages/employee/viewClient'
import EmployeeAllPartner from './pages/employee/allPartner'
import EmployeePartnerDetails from './pages/employee/viewPartner'
import EmployeeResetPassword from './pages/employee/resetPassword'
import EmployeeCreateInvoice from './pages/employee/finance/pages/CreateInvoice'
import EmployeeAllInvoices from './pages/employee/finance/pages/AllInvoices'
import EmployeeViewInvoice from './pages/employee/finance/pages/ViewInvoice'
import EmployeeResetForgetPassword from './pages/employee/resetForgetPassword'
import EmployeeEditInvoice from './pages/employee/finance/pages/editInvoice'


// for partner
import SignUp from './pages/partner/signUp'
import SignIn from './pages/partner/signIn'
import OtpVerify from './pages/partner/otpVerify'
import NewPassword from './pages/partner/newPassword'
import Dashboard from './pages/partner/dashboard'
import Profile from './pages/partner/profile'
import BankDetails from './pages/partner/bankDetails'
import NewCase from './pages/partner/Case/newCase'
import PartnerEditCase from './pages/partner/Case/editcase'
import EditProfile from './pages/partner/editProfile'
import EditBankingDetails from './pages/partner/editBankDetails'
import AllPartnerCase from './pages/partner/Case/allCases'
import PartnerViewCase from './pages/partner/Case/viewCase'
import PartnerMobileSendOtp from './pages/partner/sendMobileCode'
import PartnerForgetPassword from './pages/partner/forgetPassword'
import PartnerResetPassword from './pages/partner/resetPassword'
import PartnerAfterVerification from './pages/partner/afterVerification'
import PartnerAcceptTls from './pages/partner/acceptTls'
import PartnerViewTLS from './pages/partner/viewTls'
import PartnerServiceAgreement from './pages/partner/ServiceAgreement'


// for client routes
import ClientSignIn from './pages/client/signin'
import ClientSignUp from './pages/client/signup'
import ClientDasboard from './pages/client/dashboard'
import ClientOtpVerify from './pages/client/otpVerify'
import ClientMobileSendOtp from './pages/client/sendMobileCode'
import ClientProfile from './pages/client/profile'
import ClientEditProfile from './pages/client/editProfile'
import ClientNewCase from './pages/client/addCase'
import ClientViewAllCase from './pages/client/allCase'
import ClientViewCase from './pages/client/viewCase'
import ClientForgetPassword from './pages/client/forgetPassword'
import ClientResetPassword from './pages/client/resetPassword'
import ClientAcceptTls from './pages/client/acceptTls'
import ClientAfterVerification from './pages/client/afterVerification'
import ClientServiceAgreement from './pages/client/ClientServiceAgreement'
import ClientViewTLS from './pages/client/viewTls'
import ClientViewBill from './pages/client/viewBill'
import ClientEditCase from './pages/client/editCase'


// import template
import PublicTemplate from './template/publicTemplate'
import PanelTemplate from './template/PanelTemplate'
import BlogTemplate from './template/blogTemplate'
import PartnerTemplate from './template/partnerTemplate'
import AdminTemplate from './template/adminTemplate'
import ClientTemplate from './template/clientTemplate'
import EmployeeTemplate from './template/employeeTemplate'


export const AppContext = createContext("")
import { useLocation } from 'react-router-dom'


export default function App(){
  const location = useLocation();
  const [myAppData,setMyAppData] = useState({isLogin:false,details:""})


  useEffect(()=>{
    const token = getToken()
    // console.log("token",token);
    if(token){
        const details = getJwtDecode(token)
        setMyAppData({isLogin:true,details:details})
    }
  },[])

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // console.log("myapp",myAppData);
  
  
  return(<>
   <AppContext.Provider value={{myAppData,setMyAppData}}>
  {/* <Navbar/> */}
  <Routes>
    <Route path='/' element={<PublicTemplate><Home/></PublicTemplate>}/>
    <Route path='/about-us' element={<PublicTemplate><About/></PublicTemplate>}/>
    <Route path='/contact-us' element={<PublicTemplate><Contact/></PublicTemplate>}/>
    <Route path='/Health-insurance-claim-solution' element={<PublicTemplate><Health_Insurance/></PublicTemplate>}/>
    <Route path='/Any-Insurance-Claim-Solution' element={<PublicTemplate><Any_Insurance_Claim_Solution/></PublicTemplate>}/>
    <Route path='/Death-Claim-Solution' element={<PublicTemplate><Death_Claim_Solution/></PublicTemplate> }/>
    <Route path='/Motor-Insurance-Claim-Solution' element={<PublicTemplate><Motor_Insurance_Claim_Solution/></PublicTemplate>}/>
    <Route path='/blogs' element={<BlogTemplate><Blogs/></BlogTemplate>}/>
    <Route path='/blog/:topic' element={<BlogTemplate><ViewBlogs/></BlogTemplate>}/>
    <Route path='/career' element={<PublicTemplate><Career/></PublicTemplate>} />
    <Route path='/partnership' element={<PublicTemplate><Patnership/></PublicTemplate>} />
    <Route path='/policy' element={<PublicTemplate><Policy/></PublicTemplate>} />
    <Route path='/login' element={<Login/>}/>
    <Route path='/feedback' element={<PublicTemplate><Feedback/></PublicTemplate>}/>
    <Route path='/terms-and-condition' element={<PublicTemplate><TermsAndCondition/></PublicTemplate>}/>
    <Route path='/partner/service agreement' element={<PublicTemplate><PartnerAgreement/></PublicTemplate>}/>
    <Route path='/client/service agreement' element={<PublicTemplate><ClientAgreement/></PublicTemplate>}/>

    <Route path='*' element={<Error/>}/>


  {/* for partner */}
  <Route path='/partner/signin' element={<PanelTemplate><SignIn/></PanelTemplate>}/>
  <Route path='/partner/signup' element={<PanelTemplate><SignUp/></PanelTemplate>}/>
  <Route path='/partner/email otp verify' element={<PanelTemplate><OtpVerify/></PanelTemplate>}/>
  <Route path='/partner/send mobile otp' element={<PanelTemplate><PartnerMobileSendOtp/></PanelTemplate>}/>
  <Route path='/partner/forget password' element={<PanelTemplate><PartnerForgetPassword/></PanelTemplate>}/>
  <Route path='/partner/verification completed' element={<PanelTemplate><PartnerAfterVerification/></PanelTemplate>}/>
  <Route path='/partner/acceptTermsAndConditions/:verifyToken' element={<PanelTemplate><PartnerAcceptTls/></PanelTemplate>}/>
  <Route path='/partner/resetPassword/:verifyToken'   sensitive={true} strict={false} element={<PanelTemplate><PartnerResetPassword/></PanelTemplate>}/>
  <Route path='/partner/dashboard' element={<PartnerTemplate><Dashboard/></PartnerTemplate>}/>
  <Route path='/partner/profile' element={<PartnerTemplate><Profile/></PartnerTemplate>}/>
  <Route path='/partner/edit profile' element={<PartnerTemplate><EditProfile/></PartnerTemplate>}/>
  <Route path='/partner/edit banking details' element={<PartnerTemplate><EditBankingDetails/></PartnerTemplate>}/>
  <Route path='/partner/banking details' element={<PartnerTemplate><BankDetails/></PartnerTemplate>}/>
  <Route path='/partner/add new case' element={<PartnerTemplate><NewCase/></PartnerTemplate>}/>
  {/* <Route path='/partner/edit case/:_id' element={<PartnerTemplate><PartnerEditCase/></PartnerTemplate>}/> */}
  <Route path='/partner/all case' element={<PartnerTemplate><AllPartnerCase/></PartnerTemplate>}/>
  <Route path='/partner/view case/:_id' element={<PartnerTemplate><PartnerViewCase/></PartnerTemplate>}/>
  <Route path='/partner/view tls' element={<PartnerTemplate><PartnerViewTLS/></PartnerTemplate>}/>
  <Route path='/partner/view service agreement' element={<PartnerTemplate><PartnerServiceAgreement/></PartnerTemplate>}/>


  



{/* for admin */}
  <Route path='/admin/signin' element={<PanelTemplate><AdminSignIn/></PanelTemplate>}/>
  <Route path='/admin/signup' element={<PanelTemplate><AdminSignUp/></PanelTemplate>}/>
  <Route path='/admin/forget password' element={<PanelTemplate><AdminForgetPassword/></PanelTemplate>}/>
  <Route path='/admin/resetPassword/:verifyToken' sensitive={true} strict={false} element={<PanelTemplate><AdminResetForgetPassword/></PanelTemplate>}/>
  <Route path='/admin/dashboard' element={<AdminTemplate><AdminDashboard/></AdminTemplate>}/>
  <Route path='/admin/account setting' element={<AdminTemplate><AdminAccountSetting/></AdminTemplate>}/>
  <Route path='/admin/add new employee' element={<AdminTemplate><AdminCreateNewEmployee/></AdminTemplate>}/>
  <Route path='/admin/all case' element={<AdminTemplate><AllAdminCase/></AdminTemplate>}/>
  <Route path='/admin/view case/:_id' element={<AdminTemplate><AdminViewCase/></AdminTemplate>}/>
  <Route path='/admin/all partner' element={<AdminTemplate><AllAdminPartner/></AdminTemplate>}/>
  <Route path='/admin/partner details/:_id' element={<AdminTemplate><AdminPartnerDetails/></AdminTemplate>}/>
  <Route path='/admin/all client' element={<AdminTemplate><AllAdminClient/></AdminTemplate>}/>
  <Route path='/admin/client details/:_id' element={<AdminTemplate><AdminClientDetails/></AdminTemplate>}/>
  <Route path='/admin/edit case/:_id' element={<AdminTemplate><AdminEditCase/></AdminTemplate>}/>
  <Route path='/admin/all employee' element={<AdminTemplate><AllAdminEmployee/></AdminTemplate>}/>
  <Route path='/admin/all job' element={<AdminTemplate><AdminAllJobs/></AdminTemplate>}/>
  <Route path='/admin/all complaint' element={<AdminTemplate><AdminAllComplaint/></AdminTemplate>}/>
  <Route path='/admin/all trash partner' element={<AdminTemplate><AdminTrashPartner/></AdminTemplate>}/>
  <Route path='/admin/all trash client' element={<AdminTemplate><AdminTrashClient/></AdminTemplate>}/>
  <Route path='/admin/all trash case' element={<AdminTemplate><AdminTrashCase/></AdminTemplate>}/>
  <Route path='/admin/my-admins' element={<AdminTemplate><MyAdmins/></AdminTemplate>}/>
  <Route path='/admin/view-partner-report/:_id' element={<AdminTemplate><AdminViewPartnerReport/></AdminTemplate>}/>
  <Route path='/admin/payment' element={<AdminTemplate><PaymentRoot/></AdminTemplate>}/>
  <Route path='/admin/payment/callback' element={<AdminTemplate><div>CallBack Url</div></AdminTemplate>}/>






  {/* for employee */}
  <Route path='/employee/signin' element={<PanelTemplate><EmployeeSignIn/></PanelTemplate>}/>
  <Route path='/employee/forget password' element={<PanelTemplate><EmployeeForgetPassword/></PanelTemplate>}/>
  <Route path='/employee/dashboard' element={<EmployeeTemplate><EmployeeDasboard/></EmployeeTemplate>}/>
  <Route path='/employee/reset password' element={<EmployeeTemplate><EmployeeResetPassword/></EmployeeTemplate>}/>
  <Route path='/employee/all case' element={<EmployeeTemplate><EmployeeAllCase/></EmployeeTemplate>}/>
  <Route path='/employee/view case/:_id' element={<EmployeeTemplate><EmployeeViewCase/></EmployeeTemplate>}/>
  <Route path='/employee/all partner' element={<EmployeeTemplate><EmployeeAllPartner/></EmployeeTemplate>}/>
  <Route path='/employee/partner details/:_id' element={<EmployeeTemplate><EmployeePartnerDetails/></EmployeeTemplate>}/>
  <Route path='/employee/all client' element={<EmployeeTemplate><EmployeeAllClient/></EmployeeTemplate>}/>
  <Route path='/employee/client details/:_id' element={<EmployeeTemplate><EmployeeClientDetails/></EmployeeTemplate>}/>
  <Route path='/employee/create-invoice' element={<EmployeeTemplate><EmployeeCreateInvoice/></EmployeeTemplate>}/>
  <Route path='/employee/view-invoice/:_id' element={<EmployeeTemplate><EmployeeViewInvoice/></EmployeeTemplate>}/>
  <Route path='/employee/all-invoices' element={<EmployeeTemplate><EmployeeAllInvoices/></EmployeeTemplate>}/>
  <Route path='/employee/resetPassword/:verifyToken' sensitive={true} strict={false} element={<PanelTemplate><EmployeeResetForgetPassword/></PanelTemplate>}/>
  <Route path='/employee/edit-invoice/:_id'  element={<EmployeeTemplate><EmployeeEditInvoice/></EmployeeTemplate>}/>






  {/* for client */}
  <Route path='/client/signin' element={<PanelTemplate><ClientSignIn/></PanelTemplate>}/>
  <Route path='/client/signup' element={<PanelTemplate><ClientSignUp/></PanelTemplate>}/>
  <Route path='/client/email otp verify' element={<PanelTemplate><ClientOtpVerify/></PanelTemplate>}/>
  <Route path='/client/send mobile otp' element={<PanelTemplate><ClientMobileSendOtp/></PanelTemplate>}/>
  <Route path='/client/forget password' element={<PanelTemplate><ClientForgetPassword/></PanelTemplate>}/>
  <Route path='/client/verification completed' element={<PanelTemplate><ClientAfterVerification/></PanelTemplate>}/>
  <Route path='/client/acceptTermsAndConditions/:verifyToken' element={<PanelTemplate><ClientAcceptTls/></PanelTemplate>}/>
  <Route path='/client/resetPassword/:verifyToken'   sensitive={true} strict={false} element={<PanelTemplate><ClientResetPassword/></PanelTemplate>}/>
  <Route path='/client/dashboard' element={<ClientTemplate><ClientDasboard/></ClientTemplate>}/>
  <Route path='/client/profile' element={<ClientTemplate><ClientProfile/></ClientTemplate>}/>
  <Route path='/client/edit profile/:_id' element={<ClientTemplate><ClientEditProfile/></ClientTemplate>}/>
  <Route path='/client/add new case' element={<ClientTemplate><ClientNewCase/></ClientTemplate>}/>
  <Route path='/client/all case' element={<ClientTemplate><ClientViewAllCase/></ClientTemplate>}/>
  <Route path='/client/view case/:_id' element={<ClientTemplate><ClientViewCase/></ClientTemplate>}/>
  {/* <Route path='/client/edit case/:_id' element={<ClientTemplate><ClientEditCase/></ClientTemplate>}/> */}
  <Route path='/client/view tls' element={<ClientTemplate><ClientViewTLS/></ClientTemplate>}/>
  <Route path='/client/view bill/:_id' element={<ClientTemplate><ClientViewBill/></ClientTemplate>}/>
  <Route path='/client/view service agreement' element={<ClientTemplate><ClientServiceAgreement/></ClientTemplate>}/>





  </Routes>
  {/* <Footer/> */}
  </AppContext.Provider>

  </>)
}