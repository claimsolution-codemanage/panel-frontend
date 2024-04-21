import PartnerTemplate from '../template/partnerTemplate'
import PanelTemplate from '../template/PanelTemplate'
import {Route} from 'react-router-dom'
// for partner
import SignUp from '../pages/partner/signUp'
import SignIn from '../pages/partner/signIn'
import OtpVerify from '../pages/partner/otpVerify'
import NewPassword from '../pages/partner/newPassword'
import Dashboard from '../pages/partner/dashboard'
import Profile from '../pages/partner/profile'
import BankDetails from '../pages/partner/bankDetails'
import NewCase from '../pages/partner/Case/newCase'
import PartnerEditCase from '../pages/partner/Case/editcase'
import EditProfile from '../pages/partner/editProfile'
import EditBankingDetails from '../pages/partner/editBankDetails'
import AllPartnerCase from '../pages/partner/Case/allCases'
import PartnerViewCase from '../pages/partner/Case/viewCase'
import PartnerMobileSendOtp from '../pages/partner/sendMobileCode'
import PartnerForgetPassword from '../pages/partner/forgetPassword'
import PartnerResetPassword from '../pages/partner/resetPassword'
import PartnerAfterVerification from '../pages/partner/afterVerification'
import PartnerAcceptTls from '../pages/partner/acceptTls'
import PartnerViewTLS from '../pages/partner/viewTls'
import PartnerServiceAgreement from '../pages/partner/ServiceAgreement'
import AcceptPartnerRequest from '../pages/partner/acceptPartnerRequest'

export const partnerRoutes = [
    <Route path='/partner/signin' element={<PanelTemplate><SignIn /></PanelTemplate>} />,
    <Route path='/partner/signup' element={<PanelTemplate><SignUp /></PanelTemplate>} />,
    <Route path='/partner/email otp verify' element={<PanelTemplate><OtpVerify /></PanelTemplate>} />,
    <Route path='/partner/accept-request/:tokenId' element={<PanelTemplate><AcceptPartnerRequest /></PanelTemplate>} />,
    <Route path='/partner/send mobile otp' element={<PanelTemplate><PartnerMobileSendOtp /></PanelTemplate>} />,
    <Route path='/partner/forget password' element={<PanelTemplate><PartnerForgetPassword /></PanelTemplate>} />,
    <Route path='/partner/verification completed' element={<PanelTemplate><PartnerAfterVerification /></PanelTemplate>} />,
    <Route path='/partner/acceptTermsAndConditions/:verifyToken' element={<PanelTemplate><PartnerAcceptTls /></PanelTemplate>} />,
    <Route path='/partner/resetPassword/:verifyToken' sensitive={true} strict={false} element={<PanelTemplate><PartnerResetPassword /></PanelTemplate>} />,
    <Route path='/partner/dashboard' element={<PartnerTemplate><Dashboard /></PartnerTemplate>} />,
    <Route path='/partner/profile' element={<PartnerTemplate><Profile /></PartnerTemplate>} />,
    <Route path='/partner/edit profile' element={<PartnerTemplate><EditProfile /></PartnerTemplate>} />,
    <Route path='/partner/edit banking details' element={<PartnerTemplate><EditBankingDetails /></PartnerTemplate>} />,
    <Route path='/partner/banking details' element={<PartnerTemplate><BankDetails /></PartnerTemplate>} />,
    <Route path='/partner/add new case' element={<PartnerTemplate><NewCase /></PartnerTemplate>} />,
    <Route path='/partner/all case' element={<PartnerTemplate><AllPartnerCase /></PartnerTemplate>} />,
    <Route path='/partner/view case/:_id' element={<PartnerTemplate><PartnerViewCase /></PartnerTemplate>} />,
    <Route path='/partner/view tls' element={<PartnerTemplate><PartnerViewTLS /></PartnerTemplate>} />,
    <Route path='/partner/view service agreement' element={<PartnerTemplate><PartnerServiceAgreement /></PartnerTemplate>} />,

]
{/* <Route path='/partner/edit case/:_id' element={<PartnerTemplate><PartnerEditCase/></PartnerTemplate>}/> */ }
