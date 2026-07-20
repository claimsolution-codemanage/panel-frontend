import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"


export const allAdminCaseApi = ({ pageItemLimit = "", pgNo = 1, searchQuery = "", statusType = "", startDate = "", endDate = "", type, empId, id, isReject = "", isWeeklyFollowUp = false, isClosed = false }) => {
    return getRequest(`/admin/case/viewAllCase?limit=${pageItemLimit}&pageNo=${pgNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&isReject=${isReject}&isWeeklyFollowUp=${isWeeklyFollowUp}&isClosed=${isClosed}`)
}

export const adminChangeCaseStatusApi = (data) => {
    return putRequest(`/admin/case/changeCaseStatus`, data)
}

export const adminGetCaseByIdApi = (_id) => {
    return getRequest(`/admin/case/viewCaseById?_id=${_id}`)
}

export const adminAddCaseFileByIdApi = (_id, data) => {
    return postRequest(`/admin/case/adminAddCaseFile?_id=${_id}`, data)
}

export const adminUpdateCaseByIdApi = (_id, data) => {
    return putRequest(`/admin/case/updateCaseById?_id=${_id}`, data)
}

export const adminAddOrUpdatePaymentApi = (data) => {
    return putRequest(`/admin/case/addOrUpdatePayment`, data)
}

export const adminRenameCaseDocFolderApi = (data) => {
    return putRequest(`/admin/case/renameCaseDocFolder`, data)
}

export const adminUpdateClientCaseFeeApi = (data) => {
    return putRequest(`/admin/case/updateClientCaseFee?_id=${data?._id}&paymentId=${data?.paymentId}&paymentMode=${data?.paymentMode}`)
}

export const adminSetCaseIsActiveApi = (_id, status) => {
    return putRequest(`/admin/case/changeCaseIsActive?_id=${_id}&status=${!status}`)
}

export const adminAddClientPaymentApi = (_id, data) => {
    return putRequest(`/admin/case/addCaseFeeClient?_id=${_id}`, data)
}

export const adminAddCaseReferenceApi = (query) => {
    return putRequest(`/admin/case/addReferenceCaseAndMarge?${query}`)
}

export const adminRemoveCaseReferenceApi = (_id, type) => {
    return putRequest(`/admin/case/removeReferenceCase?_id=${_id}&type=${type}`)
}

export const adminDeleteCaseByIdApi = (id) => {
    return deleteRequest(`/admin/case/deleteCaseById?caseId=${id}`)
}

export const adminDeleteCaseDocByIdApi = (id) => {
    return deleteRequest(`/admin/case/deleteCaseDocId?_id=${id}`)
}

export const adminEditCaseProcessById = (data) => {
    return putRequest(`/admin/case/editCaseProcessById`, data)
}