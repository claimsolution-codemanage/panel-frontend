import { getRequest, postRequest } from "../axiosConfig"


export const clientAddCaseFileByIdApi = (_id, data) => {
    return postRequest(`/client/case/addCaseFile?_id=${_id}`, data)
}

export const clientViewCaseByIdApi = (_id) => {
    return getRequest(`/client/case/viewClientCaseById?_id=${_id}`)
}

export const clientViewAllCaseApi = ({ pageItemLimit, pgNo, searchQuery, statusType, startDate, endDate }) => {
    return getRequest(`/client/case/viewClientAllCase?limit=${pageItemLimit}&pageNo=${pgNo}&search=${searchQuery}&status=${statusType}&startDate=${startDate}&endDate=${endDate}&type=${true}`)
}

export const clientAddNewCaseApi = (data) => {
    return postRequest(`/client/case/addNewClientCase`, data)
}

export const getClientCaseDocumentListApi = (caseId) => {
    return getRequest(`/client/case/viewCaseDocsById/${caseId}`)
}
// case documents


// case process 
export const getClientCaseProcessListApi = (caseId) => {
    return getRequest(`/client/case/viewCaseProcessStepsById/${caseId}`)
}
// case process 