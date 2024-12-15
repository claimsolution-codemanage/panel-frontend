import axios from 'axios'
// import dotenv from 'dotenv'
// dotenv.config()
// const API_BASE = "http://localhost:8000"
const API_BASE = `${import.meta.env.VITE_API_BASE}`

// const API_IMAGE_UPLOAD =  `${import.meta.env.VITE_API_IMAGE_UPLOAD}`
import { deleteToken } from '../utils/helperFunction';
// const API_BASE = `${import.meta.env.VITE_API_BASE}`
// const API_IMAGE_UPLOAD =  `${import.meta.env.VITE_API_IMAGE_UPLOAD}`



import { getToken } from '../utils/helperFunction';

// export const API_BASE_IMG = `${API_IMAGE_UPLOAD}/images`
export const API_BASE_IMG = `images`



setheader()

export function setheader() {
  if (getToken()) {
    axios.defaults.headers.common["x-auth-token"] = getToken();
  } else {
    axios.defaults.headers.common["x-auth-token"] = "";
  }
}

axios.interceptors.response.use(
  (response) => {
    // If the response status is not 401, return the response as is
    if (response.status !== 401) {
      return response;
    } else {
      deleteToken();
      window.location.reload()
      return Promise.reject(response);
    }
  },
  (error) => {
    // Handle other errors
    // console.log("interceptor",error);
    if (error?.status == 401) {
      deleteToken();
      window.location.reload()
    }
    return Promise.reject(error);
  }
);

export const partnerAuthenticate = () => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/authenticate`)
}

// export const clientImageUpload = (data)=>{
//   setheader()
//   return axios.post(`${API_IMAGE_UPLOAD}/api/upload/client`,data)
// }
// export const partnerImageUpload = (data)=>{
//   setheader()
//   return axios.post(`${API_IMAGE_UPLOAD}/api/upload/partner`,data)
// }
// export const adminImageUpload = (data)=>{
//   setheader()
//   return axios.post(`${API_IMAGE_UPLOAD}/api/upload/admin`,data)
// }
// export const employeeImageUpload = (data)=>{
//   setheader()
//   return axios.post(`${API_IMAGE_UPLOAD}/api/upload/employee`,data)
// }

export const signUp = (data) => {
  return axios.post(`${API_BASE}/api/partner/signUp`, data)
}

export const signUpWithRequest = (data) => {
  return axios.post(`${API_BASE}/api/partner/acceptRequest`, data)
}


export const verifyOtp = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/verifyEmail`, data)
}

export const genrateNewPassword = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/setNewPassword`, data)
}

export const signin = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/signIn`, data)
}

export const getPartnerProfile = (data) => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/getProfileDetails`)
}

export const imageUpload = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/upload/imageUpload`, data)
}

export const updatePartnerProfile = (id,data) => {
  setheader()
  return axios.put(`${API_BASE}/api/partner/updateProfileDetails`, data)
}

export const getPartnerBankingDetails = () => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/getBankingDetails`)
}

export const updatePartnerBankingDetails = (id,data) => {
  setheader()
  return axios.put(`${API_BASE}/api/partner/updateBankingDetails`, data)
}

export const addNewCasePartner = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/addNewCase`, data)
}

export const allCasePartner = (pageItemLimit = "", pageNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/viewAllPartnerCase?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}`)
}

export const partnerGetCaseById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/partnerViewCaseById?_id=${_id}`)
}
export const partnerAddCaseFileById = (_id, data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/addCaseFile?_id=${_id}`, data)
}

export const partnerUpdateCaseById = (_id, data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/updateCaseById?_id=${_id}`, data)
}

export const partnerSendMobileOtpCode = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/sendMobileOtpCode`, data)
}

export const partnerMobileOtpCodeVerify = () => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/mobileNoVerify`)
}

export const partnerResendOtp = () => {
  setheader()
  return axios.post(`${API_BASE}/api/partner/resendOtp`)
}

export const partnerForgetPassword = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/partner/forgetPassword`, data)
}

export const partnerResetPassword = (data, token) => {
  setheader()
  return axios.put(`${API_BASE}/api/partner/resetPassword?verifyId=${token}`, data)
}

export const partnerAcceptTls = (token) => {
  setheader()
  return axios.put(`${API_BASE}/api/partner/acceptPartnerTerms_Conditions?verifyId=${token}`)
}

export const partnerTls = () => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/getTls`)
}

export const partnerStatement = (pageItemLimit = "", pageNo = "", partnerId = "",empId="", startDate = "", endDate = "",isPdf=false) => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/getStatement?startDate=${startDate}&endDate=${endDate}&limit=${pageItemLimit}&pageNo=${pageNo}&isPdf=${isPdf}`)
}




// for admin api
export const adminAuthenticate = () => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/authenticate`)
}

export const adminSignup = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/signup`, data)
}

export const adminSignin = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/signin`, data)
}

export const adminResetPassword = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/resetPassword`, data)
}

export const adminForgetPassword = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/forgetPassword`, data)
}

export const superAdminGetAllAdmins = (pageItemLimit = "", pageNo = "", searchQuery = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/superAdmin/allAdmin?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const superAdminSetAdminIsActive = (_id, status) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/superAdmin/setIsActiveAdmin?_id=${_id}&status=${!status}`)
}

export const superAdminDeleteAdminById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/superAdmin/deleteAdminById?_id=${id}`)
}


export const adminResetForgetPassword = (data, token) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/resetForgetPassword?verifyId=${token}`, data)
}

export const adminCreateNewEmployee = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/createEmployeeAccount`, data)
}

export const allAdminCase = (pageItemLimit = "", pageNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "", type,empId,id,isReject="") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllCase?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&isReject=${isReject}`)
}

export const adminAllCaseDownload = (searchQuery = "", statusType = "", startDate = "", endDate = "", type,empId,id,isReject) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/allcase?search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&isReject=${isReject}`,
    responseType: 'blob',
  })
}

export const adminViewPartnerReport = (partnerId = "", pageItemLimit = "", pageNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "", type) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/adminViewPartnerReport?partnerId=${partnerId}&limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const adminPartnerReportDownload = (partnerId = "", searchQuery = "", statusType = "", startDate = "", endDate = "", type) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/partnerReport?partnerId=${partnerId}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`,
    responseType: 'blob',
  })
}

export const adminEmpGetSathiEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true,empType,empId) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewEmpSathi?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&empId=${empId}`)
}

export const adminEmpDownloadSathi = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true,empType,empId) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/empSathi?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&empId=${empId}`,
    responseType: 'blob',
  })
}


export const adminViewSaleEmpCaseReport = (empSaleId = "", pageItemLimit = "", pageNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "", type) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/adminViewEmpSaleReport?empSaleId=${empSaleId}&limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const adminSaleEmpCaseReportDownload = (empSaleId = "", searchQuery = "", statusType = "", startDate = "", endDate = "", type) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/empSaleReport?empSaleId=${empSaleId}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`,
    responseType: 'blob',
  })
}


export const adminGetCaseById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewCaseById?_id=${_id}`)
}

export const adminChangeCaseStatus = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/changeCaseStatus`, data)
}

export const adminChangeBranch = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/change-branch`, data)
}

export const adminAddOrUpdatePayment = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/addOrUpdatePayment`, data)
}


export const adminEditCaseProcessById = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/editCaseProcessById`, data)
}

export const adminSetPartnerTag = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/setPartnerTag`, data)
}

export const adminSetClientTag = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/setClientTag`, data)
}

export const adminSetCaseIsActive = (_id, status) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/changeCaseIsActive?_id=${_id}&status=${!status}`)
}


export const adminSetCaseDocIsActive = (_id, status) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/unActiveDoc?_id=${_id}&status=${!status}`)
}

export const allAdminCaseDoc = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/allUnactiveCaseDoc?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}`)
}

export const allAdminPartner = (pageItemLimit = "", pageNo = "", searchQuery = "", type, startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllPartner?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}`)
}

export const adminAllPartnerDownload = (searchQuery = "", type, startDate = "", endDate = "") => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/allpartner?search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}`,
    responseType: 'blob',
  })
}

export const adminViewSaleEmpPartner = (empSaleId = "", pageItemLimit = "", pageNo = "", searchQuery = "", type, startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/adminViewEmpSalePartnerReport?empSaleId=${empSaleId}&limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}`)
}

export const adminSaleEmpPartnerDownload = (empSaleId = "", searchQuery = "", type, startDate = "", endDate = "") => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/empSalePartnerReport?empSaleId=${empSaleId}&search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}`,
    responseType: 'blob',
  })
}

export const adminRemoveSaleEmpPartner = (_id="",removePartners=[],) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/removePartner?_id=${_id}`,{removePartners})
}


export const adminGetPartnerById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewPartnerById?_id=${_id}`)
}

export const adminSetPartnerStatus = (_id, status) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/changePartnerStatus?_id=${_id}&status=${!status}`)
}

export const allAdminClient = (pageItemLimit = "", pageNo = "", searchQuery = "", type,startDate="",endDate="") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/ViewAllClient?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}`)
}

export const adminAllClientDownload = (searchQuery = "", type,startDate,endDate) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/allClient?search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}`,
    responseType: 'blob',
  })
}

export const AdminViewAllComplaint = (pageItemLimit = "", pageNo = "", searchQuery = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllComplaint?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const adminSetClientStatus = (_id, status) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/setIsActiveClient?_id=${_id}&status=${!status}`)
}

export const adminGetClientById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/ViewClientById?_id=${_id}`)
}

export const adminGetEmpProfile = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/employee/profile?_id=${_id}`)
}

export const adminGetAllEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true,empType) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/adminViewAllEmployee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&empType=${empType}`)
}


export const adminDownloadAllEmp = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true,empType) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/download/allEmployee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&empType=${empType}`,
    responseType: 'blob',
  })
}

export const adminGetNormalEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/normal-employee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const adminGetSaleEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/sale-employee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}


export const adminSetEmployeeStatus = (_id, status) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/setIsActiveEmployee?_id=${_id}&status=${!status}`)
}

export const adminGetSettingDetails = () => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/getSettingDetails`)
}

export const adminUpdateSettingDetails = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/settingDetailsUpdate`, data)
}

export const adminAddClientPayment = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/addCaseFeeClient?_id=${_id}`, data)
}

export const adminUpdateCaseById = (_id, data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/updateCaseById?_id=${_id}`, data)
}

export const adminUpdateClientCaseFee = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/updateClientCaseFee?_id=${data?._id}&paymentId=${data?.paymentId}&paymentMode=${data?.paymentMode}`)
}

export const adminUploadCompanyPartnerTls = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/uploadCompanyPartnerTls`, data)
}

export const adminUploadCompanyClientTls = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/uploadCompanyClientTls`, data)
}

export const adminShareCaseToEmployee = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/addEmployeeToCase`, data)
}

export const adminSharePartnerToSaleEmp = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/addSharePartner`, data)
}

export const adminAddPartnerRefToEmp = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/addPartnerRefToEmp`, data)
}


export const adminAddCaseCommit = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/addCaseCommit`, data)
}

export const adminDashboardData = () => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/dashboard`)
}

export const adminAddJob = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/addJob`, data)
}

export const adminRemoveJobById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteJobById?_id=${id}`)
}

export const adminAddCaseReference = (query) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/addReferenceCaseAndMarge?${query}`)
}

export const adminRemoveCaseReference = (_id, type) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/removeReferenceCase?_id=${_id}&type=${type}`)
}

export const adminDeleteCaseById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteCaseById?caseId=${id}`)
}

export const adminDeletePartnerById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deletePartnerById?partnerId=${id}`)
}

export const adminDeleteClientById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteClientById?clientId=${id}`)
}

export const adminDeleteEmployeeById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteEmployeeAccount?_id=${id}`)
}

export const adminUpdateEmployeeById = (id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/updateEmployeeAccount?_id=${id}`, data)
}


export const adminUpdateClient = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/editClient?_id=${_id}`, data)
}

export const adminUpdatePartnerProfile = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/updateParnterProfile?_id=${_id}`, data)
}

export const adminUpdatePartnerBankingDetails = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/updatePartnerBankingDetails?_id=${_id}`, data)
}

export const adminDeleteCaseDocById = (id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteCaseDocId?_id=${id}`)
}


export const adminCreateInvoice = (data, clientId='', caseId='') => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/createInvoice?clientId=${clientId}&caseId=${caseId}`, data)
}

export const adminEditInvoice = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/editInvoiceById?_id=${_id}`, data)
}


export const adminPaidInvoice = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/paidInvoiceById`, data)
}

export const adminUnactiveInvoice = (_id,type) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/unActiveInvoiceById?_id=${_id}&type=${type}`)
}

export const adminDeleteInvoice = (_id,type) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteInvoice?_id=${_id}`)
}



export const adminGetInvoiceById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewInvoiceById?_id=${_id}`)
}



export const adminViewAllInvoice = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllInvoice?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${true}`)
}

export const adminDownloadAllInvoiceApi = (searchQuery = "", startDate = "", endDate = "",type=true) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/admin/adminDownloadAllInvoice?search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${type}`,
    responseType: 'blob',
  })
}

export const adminViewAllTrashInvoice = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllInvoice?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${false}`)
}


//  for statment
export const adminCreateOrUpdateStatment = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/admin/createOrUpdateStatement`, data)
}

export const adminAllStatment= (pageItemLimit = "", pageNo = "", partnerId = "",empId="", startDate = "", endDate = "",isPdf=false) => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/getAllStatement?limit=${pageItemLimit}&pageNo=${pageNo}&partnerId=${partnerId}&empId=${empId}&startDate=${startDate}&endDate=${endDate}&isPdf=${isPdf}`)
}

export const adminStatements= (pageItemLimit = "", pageNo = "",startDate = "", endDate = "",search="") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/getStatements?limit=${pageItemLimit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

// notification
export const adminAllNotificationApi= (search="") => {
  setheader()
  return axios.get(`${API_BASE}/api/admin/getAllNotification`)
}

export const adminUpdateNotificationApi = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/admin/updateNotification`, data)
}






//  for view all jobs
export const viewAllJob = () => {
  setheader()
  return axios.get(`${API_BASE}/api/job/all`)
}







// for client api
export const clientAuthenticate = () => {
  setheader()
  return axios.get(`${API_BASE}/api/client/authenticate`)
}

export const clientSignUp = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/signup`, data)
}

export const clientSignIn = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/signin`, data)
}

export const signUpClientWithRequest = (data) => {
  return axios.post(`${API_BASE}/api/client/acceptRequest`, data)
}


export const clientEmailVerify = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/verifyEmail`, data)
}

export const clientSendMobileOtpCode = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/sendMobileOtpCode`, data)
}

export const clientMobileOtpCodeVerify = () => {
  setheader()
  return axios.post(`${API_BASE}/api/client/clientMobileNoVerify`)
}

export const getClientProfile = (data) => {
  setheader()
  return axios.get(`${API_BASE}/api/client/getClientProfile`)
}

export const clientUpdateProfile = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/updateClientProfile`, data)
}

export const clientAddNewCase = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/addNewClientCase`, data)
}

export const clientResendOtp = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/clientResendOtp`, data)
}

export const clientUpdateCaseById = (_id, data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/updateCaseById?_id=${_id}`, data)
}


export const clientViewAllCase = (pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate) => {
  setheader()
  return axios.get(`${API_BASE}/api/client/viewClientAllCase?limit=${pageItemLimit}&pageNo=${pgNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${true}`)
}

export const clientViewCaseById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/client/viewClientCaseById?_id=${_id}`)
}

export const clientForgetPassword = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/client/clientForgetPassword`, data)
}

export const clientResetPassword = (data, token) => {
  setheader()
  return axios.put(`${API_BASE}/api/client/clientResetPassword?verifyId=${token}`, data)
}

export const clientAddCaseFileById = (_id, data) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/addCaseFile?_id=${_id}`, data)
}

export const clientAcceptTls = (token) => {
  setheader()
  return axios.put(`${API_BASE}/api/client/acceptClientTerms_Conditions?verifyId=${token}`)
}

export const clientTls = () => {
  setheader()
  return axios.get(`${API_BASE}/api/client/getTls`)
}

export const clientViewAllInvoice = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/client/getClientViewAllInvoice?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}`)
}
export const clientGetInvoiceById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/client/getClientViewInvoiceById?_id=${_id}`)
}

export const clientPayInvoiceById = (invoiceId, caseId) => {
  setheader()
  return axios.post(`${API_BASE}/api/client/clientPayInvoiceById?invoiceId=${invoiceId}&caseId=${caseId}`)
}


export const clientDashboardData = () => {
  setheader()
  return axios.get(`${API_BASE}/api/client/getClientDashboardData`)
}

export const partnerDashboardData = () => {
  setheader()
  return axios.get(`${API_BASE}/api/partner/getpartnerDashboard`)
}


export const partnerAllCaseDownload = (searchQuery = "", statusType = "", startDate = "", endDate = "", type) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/partner/downloadReport?search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`,
    responseType: 'blob',
  })
}






//  for employee api

export const employeSignIn = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/signin`, data)
}
export const allEmployeeDashboardData = () => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/all/dashboard`)
}

export const employeResetPassword = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/resetPassword`, data)
}

export const employeeAllCase = (pageItemLimit = "", pageNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "",type=true,empId) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewAllCase?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&empId=${empId}`)
}

export const saleEmpPartnerReport = (pageItemLimit = "", pageNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "",type=true,empId,id) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/sale/partnerReport?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&partnerId=${id}`)
}

export const employeeChangeCaseStatus = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/changeCaseStatus`, data)
}

export const empOprUpdateEmployee = (id,data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/updateEmployeeAccount?_id=${id}`, data)
}

export const employeeGetCaseById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewCaseById?_id=${_id}`)
}

export const employeeAllPartner = (pageItemLimit = "", pageNo = "", searchQuery = "",type,startDate="",endDate="",empId=false) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewAllPartner?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}&empId=${empId}`)
}

export const employeeGetPartnerById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewPartnerById?_id=${_id}`)
}



export const employeeAllClient = (pageItemLimit = "", pageNo = "", searchQuery = "",startDate="",endDate="") => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewAllClient?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}`)
}



export const employeeGetClientById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewClientById?_id=${_id}`)
}

export const employeeForgetPassword = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/employeeForgetPassword`, data)
}

export const employeeResetForgetPassword = (data, token) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/resetForgetPassword?verifyId=${token}`, data)
}


export const employeeAuthenticate = () => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/authenticate`)
}


export const employeeAddCaseComment = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/addCaseComment`, data)
}

export const employeeUpdateCaseById = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/updateCaseById?_id=${_id}`, data)
}

export const empAddOrUpdatePayment = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/emp/empAddOrUpdatePayment`, data)
}


export const employeeUpdateClient = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/updateClient?_id=${_id}`, data)
}

export const employeeUpdatePartnerProfile = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/updatePartnerProfile?_id=${_id}`, data)
}

export const employeeUpdatePartnerBankingDetails = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/updatePartnerBankingDetails?_id=${_id}`, data)
}

export const empClientDownload = (searchQuery = "",startDate,endDate) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/download/allClient?search=${searchQuery}&startDate=${startDate}&endDate=${endDate}`,
    responseType: 'blob',
  })
}


//  for sales-emp
export const salesEmployeeAddPartner = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/addPartner`, data)
}

export const salesEmployeeAddSathi = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/addSathiTeamAcc`, data)
}

export const salesEmpAddNewCase = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/sale/addCase`, data)
}


export const financeEmployeeCreateInvoice = (data, clientId='', caseId='') => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/finance/createInvoice?clientId=${clientId}&caseId=${caseId}`, data)
}

export const financeEmployeeEditInvoice = (_id, data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/finance/editInvoiceById?_id=${_id}`, data)
}

export const financeEmployeeUnactiveInvoice = (_id, type) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/finance/unActiveInvoiceById?_id=${_id}&type=${type}`)
}

export const financeEmployeeRemoveInvoice = (_id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/employee/finance/removeInvoiceById?_id=${_id}`)
}


export const financeEmployeeGetInvoiceById = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/finance/viewInvoiceById?_id=${_id}`)
}

export const financeEmployeeDownloadInvoiceById = (_id) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/finance/downloadInvoiceById?_id=${_id}`,
    responseType: 'blob',
  })
}


export const financeEmployeeViewAllInvoice = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/finance/viewAllInvoice?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${true}`)
}

export const empDownloadAllInvoiceApi = (searchQuery = "", startDate = "", endDate = "",type=true) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/emp/empDownloadAllInvoice?search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${type}`,
    responseType: 'blob',
  })
}


export const financeEmployeeViewAllTrashInvoice = (pageItemLimit = "", pageNo = "", searchQuery = "", startDate = "", endDate = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/finance/viewAllInvoice?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}&type=${false}`)
}

//  to add complaint
export const addComplaint = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/complaint/add`, data)
}

export const adminRemoveComplaintById = (_id) => {
  setheader()
  return axios.delete(`${API_BASE}/api/admin/adminRemoveComplaintById?_id=${_id}`)
}




export const salesAllCaseDownload = (searchQuery = "", statusType = "", startDate = "", endDate = "", type,empId) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/sale/downloadCaseReport?search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&empId=${empId}`,
    responseType: 'blob',
  })
}

export const empDownloadPartnerReport = (searchQuery = "", statusType = "", startDate = "", endDate = "", type=true,empId,id) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/partnerReport?search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&partnerId=${id}`,
    responseType: 'blob',
  })
}

export const empDownloadAllPartner = (searchQuery = "",type,startDate="",endDate="",empId=false) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/download/allPartner?search=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}&empId=${empId}`,
    responseType: 'blob',
  })
}


export const empGetAllEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/head/allEmployee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}`)
}

export const empGetSathiEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true,empType,empId) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/view/sathiTeam?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&empId=${empId}`)
}

export const empDownloadSathi = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true,empType,empId) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/download/sathiTeam?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}&empId=${empId}`,
    responseType: 'blob',
  })
}

export const empAddCaseReference = (query) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/operation/addReferenceCaseAndMarge?${query}`)
}

export const empRemoveCaseReference = (_id, type) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/operation/removeReferenceCase?_id=${_id}&type=${type}`)
}


export const empOperationChangeBranch = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/operation/change-branch`,data)
}

export const empOperationPaidInvoice = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/finance/paidInvoiceById`,data)
}

export const getEmpProfile = (_id) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/profile?_id=${_id}`)
}

export const empOptGetNormalEmployee = (pageItemLimit = "", pageNo = "", searchQuery = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/operation/normalEmployee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const empOptShareSaleEmployee = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/operation/shareCase`, data)
}

export const empDownloadAllEmp = (pageItemLimit = "", pageNo = "", searchQuery = "",type=true) => {
  setheader()
  return axios({
    method: 'GET',
    url: `${API_BASE}/api/employee/download/allEmployee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}`,
    responseType: 'blob',
  })
}

export const empOpSharePartnerToSaleEmp = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/operation/addSharePartner`, data)
}

export const empAddPartnerRefToEmp = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/operation/addPartnerRefToEmp`, data)
}



export const empOpGetSaleEmp = (pageItemLimit = "", pageNo = "", searchQuery = "") => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/opeation/sale-employee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

//  for statment
export const empOpCreateOrUpdateStatment = (data) => {
  setheader()
  return axios.post(`${API_BASE}/api/employee/emp/createOrUpdateStatement`, data)
}

export const empOpAllStatment= (pageItemLimit = "", pageNo = "", partnerId = "",empId="", startDate = "", endDate = "",isPdf=false) => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/emp/getAllStatement?limit=${pageItemLimit}&pageNo=${pageNo}&partnerId=${partnerId}&empId=${empId}&startDate=${startDate}&endDate=${endDate}&isPdf=${isPdf}`)
}

export const empOpStatments= (pageItemLimit = "", pageNo = "",startDate = "", endDate = "",search='') => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/emp/getStatements?limit=${pageItemLimit}&pageNo=${pageNo}&search=${search}&startDate=${startDate}&endDate=${endDate}`)
}

// notification
export const empAllNotificationApi= (search="") => {
  setheader()
  return axios.get(`${API_BASE}/api/employee/emp/getAllNotification`)
}

export const empUpdateNotificationApi = (data) => {
  setheader()
  return axios.put(`${API_BASE}/api/employee/emp/updateNotification`, data)
}