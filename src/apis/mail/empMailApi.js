import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"


export const empSendMassMailApi = (data) => {
    return postRequest(`/employee/mail/send-mass-mail`, data)
}