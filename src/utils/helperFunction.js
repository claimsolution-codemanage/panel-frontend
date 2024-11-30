// import {jwtDecode} from 'jwt-decode'
import {jwtDecode} from 'jwt-decode'
const mytoken = "insurance_token"
export const API_BASE_IMG =  `${import.meta.env.VITE_API_BASE_IMG}`

export const getToken =()=>{
    return localStorage.getItem(mytoken)
}


export const getJwtDecode =(token)=>{
  return jwtDecode(token)
}

export const setToken =(token)=>{
    localStorage.setItem(mytoken,token)
}

export const deleteToken = ()=>{
    localStorage.removeItem(mytoken)
}

export const getCheckStorage =(file)=>{
  if(file){
    if(file?.includes("https://firebasestorage.googleapis.com/")){
      return file
    }else{
      return `${API_BASE_IMG}/${file}`
    }
  }else{
    return false
  }
}


export function formatDateToISO(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return ''; // Invalid date, return an empty string
    }
  
    const isoDate = date.toISOString().split('T')[0];
    return isoDate;
  }

export function getFormateDate(date){
  const fullYear =  new Date(date).getFullYear()
  const month = new Date(date).getMonth()+1
  const date1 = new Date(date).getDate()
 
  return `${fullYear}/${month<10 ? `0${month}` : month }/${date1<10 ? `0${date1}` : date1 }`
}

export function getFormateDMYDate(date){
  const fullYear =  new Date(date).getFullYear()
  const month = new Date(date).getMonth()+1
  const date1 = new Date(date).getDate()
 
  return `${date1<10 ? `0${date1}` : date1 }/${month<10 ? `0${month}` : month }/${fullYear}`
}

export function getFormateForDate(date){
  const fullYear =  new Date(date).getFullYear()
  const month = new Date(date).getMonth()+1
  const date1 = new Date(date).getDate()
 
  return `${fullYear}-${month<10 ? `0${month}` : month }-${date1<10 ? `0${date1}` : date1 }`
}

export function validateUploadFile(files,fileSize,fileType){
  console.log(files,fileSize,fileType);
  
  const file = files[0]
  if(files?.length>1) return { success: false, message: `Upload one file at once`, error: `upload ${fileType} failed` };
 
  if(!files & files.length==0) return { success: false, message: `Please select a file`, error: `upload ${fileType} failed` };

  const filetypes =
  fileType === 'image' ? /^image\/(jpeg|jpg|png)$/ : 
  fileType === 'pdf' ? /^application\/pdf$/ : 
  fileType === 'video' ? /^video\/(mp4|x-matroska|quicktime|x-ms-wmv)$/ : false;

if (!filetypes) {
  return { success: false, message: `${fileType} extension is not supported`, error: `upload ${fileType} failed` };
}

const mimetype = filetypes.test(file.type);
if (!mimetype) {
  const supportedFile =  fileType === 'image' ? "jpeg|jpg|png" : 
  fileType === 'pdf' ? "application/pdf" : 
  fileType === 'video' ? "mp4/x-matroska/quicktime/x-ms-wmv/" : false;
  return { success: false, message: `${fileType} upload only supports ${supportedFile}`, error: `upload ${fileType} failed` };
}

const maxSize = fileSize*1024*1024; 
if(file?.fileSize>maxSize) return { success: false, message: `${fileType} must be less than ${fileSize}Mb`, error: `upload ${fileType} failed` };


const formData = new FormData();
formData.append("file", file)
return {success:true,message:`${fileType} is supported!`,file:formData}
}
  


export const checkPhoneNo = (value,digit=10) => {
  if (!isNaN(Number(value))) {
    if (value.length <= digit) {
      return true
    }else{
      return false
    }
  }
}

export const checkNumber =(e) => {
  const value = e?.target?.value;
  if (Number(value) || value == "") {
    return true
  }else{
    return false
  }
}

export const invoiceFormatDate = (dateTime,viewDate)=>{
  if(dateTime){
      const format = new Date(dateTime)
      const year = format.getFullYear()
      const month = format.getMonth()+1 <= 9 ?  `0${format.getMonth() + 1}` : format.getMonth() + 1
      const date = format.getDate() <=9 ? `0${format.getDate()}` : format.getDate()
      return viewDate ? `${date}-${month}-${year}` : `${year}-${month}-${date}`
  }
  else{
      const format = new Date()
      const year = format.getFullYear()
      const month = format.getMonth()+1 <= 9 ?  `0${format.getMonth() + 1}` : format.getMonth() + 1
      const date = format.getDate() <=9 ? `0${format.getDate()}` : format.getDate()
      return viewDate ? `${date}-${month}-${year}` : `${year}-${month}-${date}`
  }
}