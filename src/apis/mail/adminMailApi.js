import { deleteRequest, getRequest, postRequest, putRequest } from "../axiosConfig"


export const adminSendMassMailApi = (data) => {
    return postRequest(`/admin/mail/send-mass-mail`, data)
}