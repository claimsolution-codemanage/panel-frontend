import { getRequest, postRequest } from "../axiosConfig"

export const addNewCasePartnerApi = (data) => {
    return postRequest(`/partner/case/addNewCase`, data)
}

export const allCasePartnerApi = ({ pageItemLimit = "", pgNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "" }) => {
    return getRequest(`/partner/case/viewAllPartnerCase?limit=${pageItemLimit}&pageNo=${pgNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}`)
}

export const partnerGetCaseByIdApi = (_id) => {
    return getRequest(`/partner/case/partnerViewCaseById?_id=${_id}`)
}

export const partnerAddCaseFileByIdApi = (_id, data) => {
    return postRequest(`/partner/case/addCaseFile?_id=${_id}`, data)
}

export const partnerViewCaseDocsByIdApi = (_id) => {
    return getRequest(`/partner/case/viewCaseDocsById/${_id}`)
}

export const partnerViewCaseProcessStepsByIdApi = (_id) => {
    return getRequest(`/partner/case/viewCaseProcessStepsById/${_id}`)
}