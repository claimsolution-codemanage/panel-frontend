import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"


export const empGetCaseById = (_id) => {
  return getRequest(`/employee/case/viewCaseById?_id=${_id}`)
}

export const empAllCaseApi = ({pageItemLimit = "", pgNo = "", searchQuery = "", statusType = "", startDate = "", endDate = "",type=true,empId="",id="",isReject="",isWeeklyFollowUp=false,isClosed=false}) => {
  return getRequest(`/employee/case/viewAllCase?limit=${pageItemLimit}&pageNo=${pgNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${type}&empId=${empId}&isReject=${isReject}&isWeeklyFollowUp=${isWeeklyFollowUp}&isClosed=${isClosed}`)
}

export const empUpdateCaseById = (_id, data) => {
  return putRequest(`/employee/case/updateCaseById?_id=${_id}`, data)
}

export const empChangeCaseIsActiveApi = (_id, status) => {
  setheader()
  return putRequest(`/employee/case/changeCaseIsActive?_id=${_id}&status=${!status}`)
}

export const empAddCaseFileByIdApi = (_id, data) => {
  return postRequest(`/employee/case/addCaseFile?_id=${_id}`, data)
}

export const empFindCaseByFileNoApi= (fileNo="") => {
  return getRequest(`/employee/case/findCaseByFileNo?fileNo=${fileNo}`)
}

export const empUpdateCaseStatusApi = (data) => {
  return putRequest(`/employee/case/updateCaseStatus`, data)
}

export const empAddOrUpdateCaseCommentApi = (data) => {
  return putRequest(`/employee/case/add_or_update_case_comment`, data)
}

export const empAddCaseReferenceApi = (query) => {
  return putRequest(`/employee/case/addReferenceCaseAndMarge?${query}`)
}


export const empRemoveCaseReferenceApi = (_id, type) => {
  return putRequest(`/employee/case/removeCaseReference?_id=${_id}&type=${type}`)
}

export const empAddOrUpdateCasePaymentApi = (data) => {
  return postRequest(`/employee/case/addOrUpdateCasePayment`, data)
}


export const empDeleteCaseById = (id) => {
  return deleteRequest(`/employee/case/deleteCaseById?caseId=${id}`)
}

export const empDeleteCaseDocById = (id) => {
  return deleteRequest(`/employee/case/deleteCaseDocById?_id=${id}`)
}
