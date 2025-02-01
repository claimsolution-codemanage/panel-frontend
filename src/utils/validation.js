import * as yup from 'yup'

export const empInitialValues = {
    profileImg:"",
    fullName:"",
    type:"",
    designation:"",
    mobileNo:"",
    branchId:"",
    bankName:"",
    bankBranchName:"",
    bankAccountNo:"",
    panNo:"",
    dob:"",
    address:"",
    gender:"",
    district:"",
    city:"",
    state:"",
    pinCode:""
}

export const empValidationSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    type:yup.string().required("Department is required"),
    designation:yup.string().required("Designation is required"),
    mobileNo:yup.string().required("Mobile number is required"),
    branchId:yup.string().required("Branch ID is required"),
    bankName:yup.string(),
    bankBranchName:yup.string(),
    bankAccountNo:yup.string(),
    panNo:yup.string(),
    address:yup.string(),
    DOB: yup.string(),
    pinCode: yup.string(),
    city: yup.string(),
    state: yup.string(),
    docs:yup.array()
})