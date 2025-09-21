import { getRequest, postRequest } from "../../axiosConfig"

// admin api
export const adminGetCaseFormById = ({formId="",caseId=""}) => {
  return getRequest(`/admin/caseForm/getCaseFormById/${formId}/${caseId}`)
}

export const adminCreateOrUpdateCaseFormApi = (data) => {
    return postRequest(`/admin/caseForm/createOrUpdateCaseForm`,data)
}

// employee api
export const empGetCaseFormById = ({formId="",caseId=""}) => {
  return getRequest(`/employee/caseForm/getCaseFormById/${formId}/${caseId}`)
}

export const empCreateOrUpdateCaseFormApi = (data) => {
    return postRequest(`/employee/caseForm/createOrUpdateCaseForm`,data)
}
