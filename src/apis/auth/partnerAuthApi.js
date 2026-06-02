import { getRequest, postRequest, putRequest } from "../axiosConfig"

export const partnerAuthenticateApi = () => {
  return getRequest(`/partner/authenticate`)
}

export const partnersignUpApi = (data) => {
  return postRequest(`/partner/signUp`,data)
}

export const partnerSignUpWithRequestApi = (data) => {
  return postRequest(`/partner/acceptRequest`, data)
}

export const partnerVerifyOtpApi = (data) => {
  return postRequest(`/partner/verifyEmail`, data)
}

export const partnerSendEmailVerifyOtpApi = (data) => {
  return postRequest(`/partner/send-email-otp`, data)
}

export const partnergenrateNewPasswordApi = (data) => {
  return postRequest(`/partner/setNewPassword`, data)
}

export const partnerSigninApi = (data) => {
  return postRequest(`/partner/signIn`, data)
}


export const partnerMobileOtpCodeVerifyApi = (data) => {
  return postRequest(`/partner/mobileNoVerify`,data)
}

export const partnerResendOtpApi = () => {
  return postRequest(`/partner/resendOtp`)
}

export const partnerForgetPasswordApi = (data) => {
  return putRequest(`/partner/forgetPassword`, data)
}

export const partnerResetPasswordApi = (data, token) => {
  return putRequest(`/partner/resetPassword?verifyId=${token}`, data)
}

export const partnerAcceptTlsApi = (token) => {
  return putRequest(`/partner/acceptPartnerTerms_Conditions?verifyId=${token}`)
}

export const partnerTlsApi = () => {
  return getRequest(`/partner/getTls`)
}