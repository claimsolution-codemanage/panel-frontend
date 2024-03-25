import axios from 'axios'
// const API_BASE = "http://localhost:8000"
const API_BASE = `${import.meta.env.VITE_API_BASE}`
export const API_BASE_IMG =  `${import.meta.env.VITE_API_BASE_IMG}`
import { getToken } from '../utils/helperFunction';



setheader()

export function setheader(){
  if(getToken()){
    axios.defaults.headers.common["x-auth-token"] = getToken();
  }else{
    axios.defaults.headers.common["x-auth-token"] = "";
  }
  }



  export const clientImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/image/client`,formData)
  }
  export const partnerImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/image/partner`,formData)
  }
  export const adminImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/image/admin`,formData)
  }
  export const employeeImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/image/employee`,formData)
  }


  export const partnerAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/attachment/partner?file=${type}`,formData)
  }


  export const clientAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/attachment/client?file=${type}`,formData)
  }

  export const adminAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/attachment/admin?file=${type}`,formData)
  }

  export const employeeAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE_IMG}/api/upload/attachment/employee?file=${type}`,formData)
  }