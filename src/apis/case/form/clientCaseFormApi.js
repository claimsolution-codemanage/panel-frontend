import { getRequest } from "../../axiosConfig"

export const clientGetCaseFormByIdApi = ({formId="",caseId=""}) => {
  return getRequest(`/client/caseForm/getCaseFormById/${formId}/${caseId}`)
}
