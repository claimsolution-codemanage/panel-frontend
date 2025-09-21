import { getRequest, postRequest, putRequest } from "../axiosConfig"


export const clientAuthenticateApi = () => {
  return getRequest(`/client/authenticate`)
}

export const clientSignUpApi = (data) => {
  return postRequest(`/client/signup`,data)
}

export const clientSignInApi = (data) => {
  return postRequest(`/client/signin`,data)
}

export const signUpClientWithRequestApi = (data) => {
  return postRequest(`/client/acceptRequest`,data)
}

export const clientEmailVerifyApi = (data) => {
  return postRequest(`/client/verifyEmail`,data)
}

export const clientSendMobileOtpCodeApi = (data) => {
  return postRequest(`/client/sendMobileOtpCode`,data)
}

export const clientMobileOtpCodeVerifyApi = (data) => {
  return postRequest(`/client/clientMobileNoVerify`,data)
}

export const clientForgetPasswordApi = (data) => {
  return putRequest(`/client/clientForgetPassword`, data)
}

export const clientResetPasswordApi = (data, token) => {
  return putRequest(`/client/clientResetPassword?verifyId=${token}`, data)
}

export const clientAcceptTlsApi = (token) => {
  return putRequest(`/client/acceptClientTerms_Conditions?verifyId=${token}`)
}

export const clientTlsApi = () => {
  return getRequest(`/client/getTls`)
}