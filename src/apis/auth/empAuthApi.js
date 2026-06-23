import { getRequest, postRequest, putRequest } from "../axiosConfig"


export const employeeAuthenticateApi = () => {
    return getRequest(`/employee/authenticate`)
}