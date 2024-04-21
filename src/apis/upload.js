import axios from 'axios'
const API_BASE = `${import.meta.env.VITE_API_BASE}`
import { getToken } from '../utils/helperFunction';
export const API_BASE_IMG =  `${import.meta.env.VITE_API_BASE_IMG}`



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
    return axios.post(`${API_BASE}/api/client/upload/image`,formData)
  }
  export const partnerImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/partner/upload/image`,formData)
  }
  export const adminImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/admin/upload/image`,formData)
  }
  export const employeeImageUpload = (formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/employee/upload/image`,formData)
  }


  export const partnerAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/partner/upload/attachment`,formData)
  }


  export const clientAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/client/upload/attachment`,formData)
  }

  export const adminAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/admin/upload/attachment`,formData)
  }

  export const employeeAttachementUpload = (type,formData)=>{
    setheader()
    return axios.post(`${API_BASE}/api/employee/upload/attachment`,formData)
  }