import { getRequest } from "../../axiosConfig"

export const partnerGetCaseFormByIdApi = ({formId="",caseId=""}) => {
  return getRequest(`/partner/caseForm/getCaseFormById/${formId}/${caseId}`)
}
