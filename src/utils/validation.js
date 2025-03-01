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

export const empJoiningFormInitialValues = {
    name: "",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    telephone: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    maritalStatus: "",
    panCardNo: "",
    bloodGroup: "",
    emergencyContact: { name: "", relation: "", contactNo: "" },
    educationalDetails: [{ degree: "", university: "", from: "", to: "", percentage: "", specialization: "" }],
    employmentDetails: [{ organization: "", designation: "", from: "", to: "", annualCTC: "" }],
    familyDetails: [{ name: "", relation: "", occupation: "", dateOfBirth: "" }],
    professionalReferences: [{ name: "", organization: "", designation: "", contactNo: "" }],
    signature: "",
    place: "",
  }

  export const empJoiningFormValidationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    mobile: yup.string().matches(/^\d{12}$/, "Invalid mobile number").required("Mobile number is required"),
    telephone: yup.string().matches(/^\d{10}$/, "Invalid number"),
    email: yup.string().email("Invalid email").required("Email is required"),
    dateOfBirth: yup.date().required("Date of birth is required"),
    emergencyContact: yup.object().shape({
      name: yup.string().required("Contact name is required"),
      contactNo: yup.string().matches(/^\d{10}$/, "Invalid contact number").required("Contact number is required"),
    }),
    educationalDetails: yup.array().of(
        yup.object().shape({
          degree: yup.string().required("Degree is required"),
          university: yup.string().required("University is required"),
          from: yup.string().required("From is required"),
          to: yup.string().required("To is required"),
        })
      ),
      employmentDetails: yup.array().of(
        yup.object().shape({
          organization: yup.string().required("Organization is required"),
          designation: yup.string().required("Designation is required"),
          from: yup.string().required("From is required"),
          to: yup.string().required("To is required"),
        })
      ),
      familyDetails: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Name is required"),
          relation: yup.string().required("Relation is required"),
        })
      ),
      professionalReferences: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Name is required"),
          organization: yup.string().required("Organization is required"),
        })
      ),
  });
