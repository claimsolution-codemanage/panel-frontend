import axios from 'axios'
// import dotenv from 'dotenv'
// dotenv.config()
// const API_BASE = "http://localhost:8000"
const API_BASE = `${import.meta.env.VITE_API_BASE}`
const API_IMAGE_UPLOAD =  `${import.meta.env.VITE_API_IMAGE_UPLOAD}`
import { deleteToken } from '../utils/helperFunction';
// const API_BASE = `${import.meta.env.VITE_API_BASE}`
// const API_IMAGE_UPLOAD =  `${import.meta.env.VITE_API_IMAGE_UPLOAD}`



import { getToken } from '../utils/helperFunction';

export const API_BASE_IMG = `${API_IMAGE_UPLOAD}/images`
// export const API_BASE_IMG = `${API_BASE}/images`



setheader()

export function setheader(){
  if(getToken()){
    axios.defaults.headers.common["x-auth-token"] = getToken();
  }else{
    axios.defaults.headers.common["x-auth-token"] = "";
  }
  }

  axios.interceptors.response.use(
    (response) => {
      // If the response status is not 401, return the response as is
      if (response.status !== 401) {
        return response;
      }else{
        deleteToken();
        window.location.reload()
        return Promise.reject(response);
      }
    },
    (error) => {
      // Handle other errors
      // console.log("interceptor",error);
      if(error?.status==401){
        deleteToken();
        window.location.reload()
      }
      return Promise.reject(error);
    }
  );

export const partnerAuthenticate = ()=>{
    setheader()
    return axios.get(`${API_BASE}/api/partner/authenticate`)
  }

  export const clientImageUpload = (data)=>{
    setheader()
    return axios.post(`${API_IMAGE_UPLOAD}/api/upload/client`,data)
  }
  export const partnerImageUpload = (data)=>{
    setheader()
    return axios.post(`${API_IMAGE_UPLOAD}/api/upload/partner`,data)
  }
  export const adminImageUpload = (data)=>{
    setheader()
    return axios.post(`${API_IMAGE_UPLOAD}/api/upload/admin`,data)
  }
  export const employeeImageUpload = (data)=>{
    setheader()
    return axios.post(`${API_IMAGE_UPLOAD}/api/upload/employee`,data)
  }

export const signUp = (data)=>{
 return axios.post(`${API_BASE}/api/partner/signUp`,data)
}

export const verifyOtp = (data)=>{
    setheader()
    return axios.post(`${API_BASE}/api/partner/verifyEmail`,data)
   }

export const genrateNewPassword = (data)=>{
    setheader()
    return axios.post(`${API_BASE}/api/partner/setNewPassword`,data)
   }

export const signin = (data)=>{
    setheader()
    return axios.post(`${API_BASE}/api/partner/signIn`,data)
   }

export const getPartnerProfile = (data)=>{
    setheader()
    return axios.get(`${API_BASE}/api/partner/getProfileDetails`)
   }

export const imageUpload = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/upload/imageUpload`,data)
}

export const updatePartnerProfile = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/partner/updateProfileDetails`,data)
}

export const getPartnerBankingDetails = ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/partner/getBankingDetails`)
}

export const updatePartnerBankingDetails = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/partner/updateBankingDetails`,data)
}

export const addNewCasePartner = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/partner/addNewCase`,data)
}

export const allCasePartner = (pageItemLimit="",pageNo="",searchQuery="",statusType="",startDate="",endDate="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/partner/viewAllPartnerCase?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}`)
}

export const partnerGetCaseById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/partner/partnerViewCaseById?_id=${_id}`)
}
export const partnerAddCaseFileById = (_id,data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/partner/addCaseFile?_id=${_id}`,data)
}

export const partnerUpdateCaseById = (_id,data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/partner/updateCaseById?_id=${_id}`,data)
}

export const partnerSendMobileOtpCode = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/partner/sendMobileOtpCode`,data)
}

export const partnerMobileOtpCodeVerify = ()=>{
  setheader()
  return axios.post(`${API_BASE}/api/partner/mobileNoVerify`)
}

export const partnerResendOtp = ()=>{
  setheader()
  return axios.post(`${API_BASE}/api/partner/resendOtp`)
}

export const partnerForgetPassword = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/partner/forgetPassword`,data)
}

export const partnerResetPassword = (data,token)=>{
  setheader()
  return axios.put(`${API_BASE}/api/partner/resetPassword?verifyId=${token}`,data)
}

export const partnerAcceptTls =(token)=>{
  setheader()
  return axios.put(`${API_BASE}/api/partner/acceptPartnerTerms_Conditions?verifyId=${token}`)
}

export const partnerTls =()=>{
  setheader()
  return axios.get(`${API_BASE}/api/partner/getTls`)
}




// for admin api
export const adminAuthenticate = ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/authenticate`)
}

export const adminSignup = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/admin/signup`,data)
}

export const adminSignin = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/admin/signin`,data)
}

export const adminResetPassword = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/admin/resetPassword`,data)
}

export const adminForgetPassword = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/forgetPassword`,data)
}

export const superAdminGetAllAdmins = (pageItemLimit="",pageNo="",searchQuery="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/superAdmin/allAdmin?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const superAdminSetAdminIsActive = (_id,status)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/superAdmin/setIsActiveAdmin?_id=${_id}&status=${!status}`)
}

export const superAdminDeleteAdminById = (id)=>{
  setheader()
  return axios.delete(`${API_BASE}/api/admin/superAdmin/deleteAdminById?_id=${id}`)
}


export const adminResetForgetPassword = (data,token)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/resetForgetPassword?verifyId=${token}`,data)
}

export const adminCreateNewEmployee = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/admin/createEmployeeAccount`,data)
}

export const allAdminCase = (pageItemLimit="",pageNo="",searchQuery="",statusType="",startDate="",endDate="",type)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllCase?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const adminViewPartnerReport = (partnerId="",pageItemLimit="",pageNo="",searchQuery="",statusType="",startDate="",endDate="",type)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/adminViewPartnerReport?partnerId=${partnerId}&limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
}

export const adminGetCaseById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewCaseById?_id=${_id}`)
}

export const adminChangeCaseStatus = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/changeCaseStatus`,data)
}


export const adminEditCaseProcessById = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/editCaseProcessById`,data)
}

export const adminSetPartnerTag = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/setPartnerTag`,data)
}

export const adminSetClientTag = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/setClientTag`,data)
}

export const adminSetCaseIsActive = (_id,status)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/changeCaseIsActive?_id=${_id}&status=${!status}`)
}

export const allAdminPartner = (pageItemLimit="",pageNo="",searchQuery="",type)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllPartner?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}`)
}

export const adminGetPartnerById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewPartnerById?_id=${_id}`)
}

export const adminSetPartnerStatus = (_id,status)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/changePartnerStatus?_id=${_id}&status=${!status}`)
}

export const allAdminClient = (pageItemLimit="",pageNo="",searchQuery="",type)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/ViewAllClient?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&type=${type}`)
}

export const AdminViewAllComplaint = (pageItemLimit="",pageNo="",searchQuery="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/viewAllComplaint?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const adminSetClientStatus = (_id,status)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/setIsActiveClient?_id=${_id}&status=${!status}`)
}

export const adminGetClientById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/ViewClientById?_id=${_id}`)
}

export const adminGetAllEmployee = (pageItemLimit="",pageNo="",searchQuery="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/adminViewAllEmployee?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const adminSetEmployeeStatus = (_id,status)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/setIsActiveEmployee?_id=${_id}&status=${!status}`)
}

export const adminGetSettingDetails = ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/getSettingDetails`)
}

export const adminUpdateSettingDetails = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/settingDetailsUpdate`,data)
}

export const adminAddClientPayment = (_id,data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/addCaseFeeClient?_id=${_id}`,data)
}

export const adminUpdateCaseById = (_id,data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/admin/updateCaseById?_id=${_id}`,data)
}

export const adminUpdateClientCaseFee = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/updateClientCaseFee?_id=${data?._id}&paymentId=${data?.paymentId}&paymentMode=${data?.paymentMode}`)
}

export const adminUploadCompanyPartnerTls = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/uploadCompanyPartnerTls`,data)
}

export const adminUploadCompanyClientTls = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/uploadCompanyClientTls`,data)
}

export const adminShareCaseToEmployee = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/addEmployeeToCase`,data)
}

export const adminAddCaseCommit = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/addCaseCommit`,data)
}

export const adminDashboardData= ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/admin/dashboard`)
}

export const adminAddJob= (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/admin/addJob`,data)
}

export const adminRemoveJobById= (id)=>{
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteJobById?_id=${id}`)
}

export const adminAddCaseReference = (query)=>{
  setheader()
  return axios.put(`${API_BASE}/api/admin/addReferenceCaseAndMarge?${query}`)
}

export const adminDeleteCaseById = (id)=>{
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteCaseById?caseId=${id}`)
}

export const adminDeletePartnerById = (id)=>{
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deletePartnerById?partnerId=${id}`)
}

export const adminDeleteClientById = (id)=>{
  setheader()
  return axios.delete(`${API_BASE}/api/admin/deleteClientById?clientId=${id}`)
}




//  for view all jobs
export const viewAllJob= ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/job/all`)
}


// for client api
export const clientAuthenticate = ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/client/authenticate`)
}

export const clientSignUp = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/signup`,data)
}

export const clientSignIn = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/signin`,data)
}

export const clientEmailVerify = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/verifyEmail`,data)
}

export const clientSendMobileOtpCode = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/sendMobileOtpCode`,data)
}

export const clientMobileOtpCodeVerify = ()=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/clientMobileNoVerify`)
}

export const getClientProfile = (data)=>{
  setheader()
  return axios.get(`${API_BASE}/api/client/getClientProfile`)
}

export const clientUpdateProfile = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/updateClientProfile`,data)
}

export const clientAddNewCase = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/addNewClientCase`,data)
}

export const clientResendOtp = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/clientResendOtp`,data)
}

export const clientUpdateCaseById = (_id,data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/updateCaseById?_id=${_id}`,data)
}


export const clientViewAllCase = (pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate)=>{
  setheader()
  return axios.get(`${API_BASE}/api/client/viewClientAllCase?limit=${pageItemLimit}&pageNo=${pgNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}`)
}

export const clientViewCaseById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/client/viewClientCaseById?_id=${_id}`)
}

export const clientForgetPassword = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/client/clientForgetPassword`,data)
}

export const clientResetPassword = (data,token)=>{
  setheader()
  return axios.put(`${API_BASE}/api/client/clientResetPassword?verifyId=${token}`,data)
}

export const clientAddCaseFileById = (_id,data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/client/addCaseFile?_id=${_id}`,data)
}

export const clientAcceptTls =(token)=>{
  setheader()
  return axios.put(`${API_BASE}/api/client/acceptClientTerms_Conditions?verifyId=${token}`)
}

export const clientTls =()=>{
  setheader()
  return axios.get(`${API_BASE}/api/client/getTls`)
}

export const clientDashboardData =()=>{
  setheader()
  return axios.get(`${API_BASE}/api/client/getClientDashboardData`)
}

export const partnerDashboardData =()=>{
  setheader()
  return axios.get(`${API_BASE}/api/partner/getpartnerDashboard`)
}



//  for employee api

export const employeSignIn = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/employee/signin`,data)
}
export const allEmployeeDashboardData= ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/all/dashboard`)
}

export const employeResetPassword = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/employee/resetPassword`,data)
}

export const employeeAllCase = (pageItemLimit="",pageNo="",searchQuery="",statusType="",startDate="",endDate="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewAllCase?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}`)
}

export const employeeChangeCaseStatus = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/employee/changeCaseStatus`,data)
}

export const employeeGetCaseById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewCaseById?_id=${_id}`)
}

export const employeeAllPartner = (pageItemLimit="",pageNo="",searchQuery="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewAllPartner?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}

export const employeeGetPartnerById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewPartnerById?_id=${_id}`)
}



export const employeeAllClient = (pageItemLimit="",pageNo="",searchQuery="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewAllClient?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}`)
}



export const employeeGetClientById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/viewClientById?_id=${_id}`)
}

export const employeeForgetPassword = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/employee/employeeForgetPassword`,data)
}

export const employeeResetForgetPassword = (data,token)=>{
  setheader()
  return axios.put(`${API_BASE}/api/employee/resetForgetPassword?verifyId=${token}`,data)
}


export const employeeAuthenticate = ()=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/authenticate`)
}


export const employeeAddCaseComment = (data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/employee/addCaseComment`,data)
}

export const financeEmployeeCreateInvoice = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/employee/finance/createInvoice`,data)
}

export const financeEmployeeEditInvoice = (_id,data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/employee/finance/editInvoiceById?_id=${_id}`,data)
}

export const financeEmployeeUnactiveInvoice = (_id,data)=>{
  setheader()
  return axios.put(`${API_BASE}/api/employee/finance/removeInvoiceById?_id=${_id}`)
}


export const financeEmployeeGetInvoiceById = (_id)=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/finance/viewInvoiceById?_id=${_id}`)
}

export const financeEmployeeDownloadInvoiceById = (_id)=>{
  setheader()
  return axios({
    method:'GET',
    url:`${API_BASE}/api/employee/finance/downloadInvoiceById?_id=${_id}`,
    responseType:'blob',
  })
}


export const financeEmployeeViewAllInvoice = (pageItemLimit="",pageNo="",searchQuery="",startDate="",endDate="")=>{
  setheader()
  return axios.get(`${API_BASE}/api/employee/finance/viewAllInvoice?limit=${pageItemLimit}&pageNo=${pageNo}&search=${searchQuery}&startDate=${startDate}&endDate=${endDate}`)
}

//  to add complaint
export const addComplaint = (data)=>{
  setheader()
  return axios.post(`${API_BASE}/api/complaint/add`,data)
}

export const adminRemoveComplaintById = (_id)=>{
  setheader()
  return axios.delete(`${API_BASE}/api/admin/adminRemoveComplaintById?_id=${_id}`)
}


