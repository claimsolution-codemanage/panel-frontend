import * as yup from 'yup'
import { allowedEmailDomains } from './constant'

export const empInitialValues = {
    docs:[],
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
    pinCode:"",
    managerId:"",
    headEmpId:""
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
  docs: yup.array(),
  headEmpId: yup.mixed().test("headEmpId", "Required",
    function (value) {
      if (!value?.value) {
        return false
      }
      return true
    }),
  managerId: yup.mixed().test("headEmpId", "Required",
    function (value) {
      if (!value?.value) {
        return false
      }
      return true
    }),
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


export const groInitialValues = {
  specialCase:false,
  partnerFee:"",
  consultantFee:"",
  groFilingDate: "",
  groStatusUpdates: [],
  queryHandling: [],
  approved: false,
  approvalDate:"",
  approvedAmount: "",
  attachments: [],
  queryReply: [],
  isSettelment: false,
  dateOfPayment: "",
  utrNumber: "",
  bankName: "",
  chequeNumber: "",
  chequeDate: "",
  amount: "",
  transactionDate: "",
  paymentMode: "",
  approvalLetter:"",
  approvalLetterPrivate:false
};

export const groValidationSchema = yup.object().shape({
  partnerFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "partnerFee",
    "Partner fee is required",
    function (value) {
      const { isSettelment,specialCase } = this.parent;
      return (isSettelment || specialCase) ? value && !isNaN(value) : true
    }),
  consultantFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "consultantFee",
    "Consultant fee is required",
    function (value) {
      const { approved, specialCase } = this.parent;
      return (approved || specialCase) ? value && !isNaN(value) : true
    }),
  groStatusUpdates: yup.array().of(
    yup.object().shape({
      status: yup.string().required("Status is required"),
      remarks: yup.string(),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  queryHandling: yup.array().of(
    yup.object().shape({
      remarks: yup.string().required("Remarks is required"),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  queryReply: yup.array().of(
    yup.object().shape({
      remarks: yup.string().required("Remarks is required"),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  groFilingDate: yup.string().required("Filing Date is required"),
  approvedAmount: yup.string().test(
    "approved",
    "Approved amount is required",
    function (value) {
      const { approved } = this.parent;
      return approved ?  approved && value > 0 :true
    }),
  approvalDate: yup.string().test(
    "approved",
    "Approved date is required",
    function (value) {
      const { approved } = this.parent;
      return approved ?  approved && value:true
    }),
  paymentMode: yup.string()
    .test(
      "Payment mode is required","Payment mode is required",
      function (value) {
        const { isSettelment } = this.parent;
        return !isSettelment || (value && value.trim() !== "");
      }
    ),
  dateOfPayment: yup.date().test("required-datepayment", "Date of payment is required",
    function (value) {
      const { isSettelment } = this.parent;
      return !isSettelment || value;
    }
  ),
  utrNumber: yup.string()
    .test(
      "is-required-htmlFor-upi","UTR Number is required for UPI",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || (paymentMode !== "UPI" || (value && value.trim() !== ""));
      }
    ),

  bankName: yup.string()
    .test(
      "is-required-htmlFor-bank-modes",
      "Bank Name is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || !["Cheque", "Net Banking"].includes(paymentMode) || (value && value.trim() !== "");
      }
    ),

  chequeNumber: yup.string()
    .test(
      "is-required-htmlFor-cheque",
      "Cheque Number is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || paymentMode !== "Cheque" || (value && value.trim() !== "");
      }
    ),

  chequeDate: yup.date()
    .test(
      "is-required-htmlFor-cheque",
      "Cheque Date is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || paymentMode !== "Cheque" || !!value;
      }
    ),

  amount: yup.number()
    .test(
      "is-required-htmlFor-cheque",
      "Amount is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || (value && !isNaN(value));
      }
    )
    .typeError("Amount must be a number"),

  transactionDate: yup.date()
    .test(
      "is-required-htmlFor-net-banking",
      "Transaction Date is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || paymentMode !== "Net Banking" || !!value;
      }
    ),

});

export const ombudsmanInitialValues = {
  specialCase:false,
  partnerFee:"",
  consultantFee:"",
  filingDate: "",
  complaintNumber:"",
  method:"online",
  statusUpdates: [],
  queryHandling: [],
  approved: false,
  approvalDate:"",
  approvedAmount: "",
  attachments: [],
  queryReply: [],
  hearingSchedule:[],
  awardPart:[],
  isSettelment: false,
  dateOfPayment: "",
  utrNumber: "",
  bankName: "",
  chequeNumber: "",
  chequeDate: "",
  amount: "",
  transactionDate: "",
  paymentMode: "",
  approvalLetter:"",
  approvalLetterPrivate:false
};

export const ombudsmanValidationSchema = yup.object().shape({
  partnerFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "partnerFee",
    "Partner fee is required",
    function (value) {
      const { isSettelment,specialCase } = this.parent;
      return (isSettelment || specialCase) ? value && !isNaN(value) : true
    }),
  consultantFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "consultantFee",
    "Consultant fee is required",
    function (value) {
      const { approved, specialCase } = this.parent;
      return (approved || specialCase) ? value && !isNaN(value) : true
    }),
  statusUpdates: yup.array().of(
    yup.object().shape({
      status: yup.string().required("Status is required"),
      remarks: yup.string(),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  queryHandling: yup.array().of(
    yup.object().shape({
      remarks: yup.string().required("Remarks is required"),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  queryReply: yup.array().of(
    yup.object().shape({
      remarks: yup.string().required("Remarks is required"),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  hearingSchedule: yup.array().of(
    yup.object().shape({
      remarks: yup.string().required("Remarks is required"),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  awardPart: yup.array().of(
    yup.object().shape({
      type: yup.string().required("Type is required"),
      remarks: yup.string().required("Remarks is required"),
      date: yup.string().required("Date is required"),
      attachment: yup.string().required("Attachment is required"),
    })
  ),
  filingDate: yup.string().required("Filing Date is required"),
  complaintNumber: yup.string().required("Complaint number is required"),
  method: yup.string().required("Method is required"),
  approvedAmount: yup.string().test(
    "approved",
    "Approved amount is required",
    function (value) {
      const { approved } = this.parent;
      return approved ?  approved && value:true
    }),
  approvalDate: yup.string().test(
    "approved",
    "Approved date is required",
    function (value) {
      const { approved } = this.parent;
      return approved ?  value:true
    }),
  paymentMode: yup.string()
    .test(
      "Payment mode is required","Payment mode is required",
      function (value) {
        const { isSettelment } = this.parent;
        return !isSettelment || (value && value.trim() !== "");
      }
    ),
  dateOfPayment: yup.date().test("required-datepayment", "Date of payment is required",
    function (value) {
      const { isSettelment } = this.parent;
      return !isSettelment || value;
    }
  ),
  utrNumber: yup.string()
    .test(
      "is-required-htmlFor-upi","UTR Number is required for UPI",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || (paymentMode !== "UPI" || (value && value.trim() !== ""));
      }
    ),

  bankName: yup.string()
    .test(
      "is-required-htmlFor-bank-modes",
      "Bank Name is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || !["Cheque", "Net Banking"].includes(paymentMode) || (value && value.trim() !== "");
      }
    ),

  chequeNumber: yup.string()
    .test(
      "is-required-htmlFor-cheque",
      "Cheque Number is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || paymentMode !== "Cheque" || (value && value.trim() !== "");
      }
    ),

  chequeDate: yup.date()
    .test(
      "is-required-htmlFor-cheque",
      "Cheque Date is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || paymentMode !== "Cheque" || !!value;
      }
    ),

  amount: yup.number()
    .test(
      "is-required-htmlFor-cheque",
      "Amount is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || (value && !isNaN(value));
      }
    )
    .typeError("Amount must be a number"),

  transactionDate: yup.date()
    .test(
      "is-required-htmlFor-net-banking",
      "Transaction Date is required",
      function (value) {
        const { paymentMode, isSettelment } = this.parent;
        return !isSettelment || paymentMode !== "Net Banking" || !!value;
      }
    ),

});

// Dynamic validation schema based on form value of paymentMode
export const paymentValidationSchema = yup.object({
  paymentMode: yup.string()
    .required("Payment mode is required")
    .oneOf(["Cash", "UPI", "Web", "Cheque", "Net Banking"], "Invalid payment mode"),

  dateOfPayment: yup.date()
    .required("Date of payment is required"),

  utrNumber: yup.string()
    .test(
      "is-required-htmlFor-upi",
      "UTR Number is required for UPI",
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== "UPI" || (value && value.trim() !== "");
      }
    ),

  bankName: yup.string()
    .test(
      "is-required-htmlFor-bank-modes",
      "Bank Name is required",
      function (value) {
        const { paymentMode } = this.parent;
        return !["Cheque", "Net Banking"].includes(paymentMode) || (value && value.trim() !== "");
      }
    ),

  chequeNumber: yup.string()
    .test(
      "is-required-htmlFor-cheque",
      "Cheque Number is required",
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== "Cheque" || (value && value.trim() !== "");
      }
    ),

  chequeDate: yup.date()
    .test(
      "is-required-htmlFor-cheque",
      "Cheque Date is required",
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== "Cheque" || !!value;
      }
    ),

  amount: yup.number()
    .test(
      "is-required-htmlFor-cheque",
      "Amount is required",
      function (value) {
        const { paymentMode } = this.parent;
        return (value && !isNaN(value));
      }
    )
    .typeError("Amount must be a number"),

  transactionDate: yup.date()
    .test(
      "is-required-htmlFor-net-banking",
      "Transaction Date is required",
      function (value) {
        const { paymentMode } = this.parent;
        return paymentMode !== "Net Banking" || !!value;
      }
    ),
})
    
export const paymentInitialValues = {
  dateOfPayment: "",
  utrNumber: "",
  bankName: "",
  chequeNumber: "",
  chequeDate: "",
  amount: "",
  transactionDate: "",
  paymentMode: ""
};

export const partnerProfileInitialValue = {
  profilePhoto: "",
  consultantName: "",
  consultantCode: "",
  associateWithUs: "",
  primaryEmail: "",
  alternateEmail: "",
  primaryMobileNo: "",
  alternateMobileNo: "",
  whatsupNo: "",
  panNo: "",
  aadhaarNo: "",
  dob: "",
  gender: "",
  businessName: "",
  companyName: "",
  natureOfBusiness: "",
  designation: "",
  areaOfOperation: "",
  workAssociation: "",
  state: "",
  district: "",
  city: "",
  pinCode: "",
  about: "",
  kycPhoto: "",
  kycAadhaar: "",
  kycAadhaarBack: "",
  kycPan: "",
  address: "",
}

export const partnerProfileValidationSchema = yup.object({
  consultantName: yup.string().required("Consultant name is required"),
  primaryEmail: yup.string().email("Invalid email").required("Primary email is required"),
  primaryMobileNo: yup.string().required("Primary mobile is required"),
  aadhaarNo: yup.string().required("Aadhaar is required"),
  dob: yup.date().required("DOB is required"),
  gender: yup.string().required("Gender is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  pinCode: yup.string().required("PIN is required"),
  address: yup.string().required("Address is required"),
})

export const partnerBankInitialValue = {
  bankName: "",
  bankAccountNo: "",
  bankBranchName: "",
  gstNo: "",
  panNo: "",
  ifscCode: "",
  upiId: "",
  cancelledChequeImg: "",
  gstCopyImg: "",
}

export const partnerBankValidationSchema = yup.object({
  bankName: yup.string().required("Bank name is required"),
  bankAccountNo: yup.string().required("Account number is required"),
  bankBranchName: yup.string().required("Bank branch name is required"),
  gstNo: yup.string().min(15,"Max 15 character").max(15,"Max 15 character"),
  panNo:yup.string().min(10,"Min 10 character").max(10,"Max 10 character").required("PAN no is required"),
  ifscCode: yup.string().required("IFSC code is required"),
  upiId:yup.string(),
  cancelledChequeImg: yup.string(),
  gstCopyImg:yup.string(),
})

export const addEmpInitialValue = {
fullName: "", 
email: "", 
empId: "", 
branchId: "", 
mobileNo: "", 
type: "", 
designation: "",
headEmpId:"",
managerId:""
}

export const addEmpValidationSchema = yup.object({
  fullName: yup.string().required("Required"),
  email: yup.string().required("Required"),
  empId: yup.string().required("Required"),
  branchId: yup.string().required("Required"),
  mobileNo: yup.string().min(12, "Min digit 12").max(12, "Max digit 12").required("Required"),
  type: yup.string().required("Required"),
  designation: yup.string().required("Required"),
  headEmpId: yup.mixed().test("headEmpId", "Required",
    function (value) {
      if (!value?.value) {
        return false
      }
      return true
    }),
  managerId: yup.mixed().test("headEmpId", "Required",
    function (value) {
      if (!value?.value) {
        return false
      }
      return true
    }),
})

export const signInOrSignUpInitialValue = {
  email: "",
  password: "",
}

export const signInOrSignUpValidationSchema = yup.object({
  password: yup.string().required("Please enter your Password"),
  email: yup.string().email("Enter valid Email").required("Please enter your Email")
      .test(
        "allowed-domain",
        "Email domain not supported",
        (value) => {
          if (!value) return false;
          // Allow business users with custom domains
          const domainPart = value.split('@')[1];
          if (!domainPart) return false;
          // If matches allowed list OR is not in public list (i.e. a business email)
          return allowedEmailDomains?.includes(`@${domainPart?.toLowerCase()}`);
        }
      ),
})

export const partnerSignUpInitialValue = {
fullName: "", email: "", mobileNo: "", password: "",workAssociation: "", areaOfOperation: "", agreement: false,
}

export const partnerSignUpValidationSchema = yup.object({
  email: yup.string().email("Enter valid Email").required("Please enter your Email")
    .test(
      "allowed-domain",
      "Email domain not supported",
      (value) => {
        if (!value) return false;
        // Allow business users with custom domains
        const domainPart = value.split('@')[1];
        if (!domainPart) return false;
        // If matches allowed list OR is not in public list (i.e. a business email)
        return allowedEmailDomains?.includes(`@${domainPart?.toLowerCase()}`);
      }
    ),
  fullName: yup.string().required("Please enter your Full Name"),
  password: yup.string().min(8, "Password must have minimum 8 character").required("Please enter your Password"),
  mobileNo: yup.string().required("Please enter your Mobile No."),
  workAssociation: yup.string().required("Please select your Work Association"),
  areaOfOperation: yup.string().required("Please enter your Area of Operation"),
  agreement: yup.bool()
})

export const clientSignUpInitialValue = {
fullName: "", email: "", mobileNo: "", password: "", agreement: false
}

export const clientSignUpValidationSchema = yup.object({
  email: yup.string().email("Enter valid Email").required("Please enter your Email")
    .test(
      "allowed-domain",
      "Email domain not supported",
      (value) => {
        if (!value) return false;
        // Allow business users with custom domains
        const domainPart = value.split('@')[1];
        if (!domainPart) return false;
        // If matches allowed list OR is not in public list (i.e. a business email)
        return allowedEmailDomains?.includes(`@${domainPart?.toLowerCase()}`);
      }
    ),
  fullName: yup.string().required("Please enter your Full Name"),
  password: yup.string().min(8, "Password must have minimum 8 character").required("Please enter your Password"),
  mobileNo: yup.string().required("Please enter your Mobile No."),
  agreement: yup.bool()
})

// invoice sender validation
export const senderInvInitalValues = {
  name: "ADAKIYA CONSULTANCY SERVICES PVT.LTD",
  address: "A-4 & 5, 3rd Floor, Rajupark, Devli Road, Near Domino's Pizza, New Delhi -110080,India",
  state: "Delhi",
  country: "IN",
  pinCode: "110062",
  gstNo: "07AAYCA7531P1ZR",
  panNo: "AAYCA7531P",
  email: "claimsolution.in@gmail.com",
  mobileNo: "011 49858616"
}
export const senderValidationSchema = yup.object().shape({
  name: yup.string().required('Sender name is required'),
  address: yup.string().required('Sender address is required'),
  state: yup.string().required('Sender state is required'),
  country: yup.string().required('Sender country is required'),
  pinCode: yup.string().required('Sender pin code is required'),
  gstNo: yup.string().required('Sender GST number is required'),
  panNo: yup.string().required('Sender PAN number is required'),
  email: yup.string().email('Invalid email').required('Sender email is required'),
  mobileNo: yup.string().required('Sender mobile number is required'),
})

// invoice receiver validation
export const receiverInvInitalValues = {
  name: "",
  address: "",
  state: "",
  country: "IN",
  pinCode: "",
  gstNo: "",
  panNo: "",
  email: "",
  mobileNo: ""
}
export const receiverValidationSchema = yup.object().shape({
  name: yup.string().required('Receiver name is required'),
  address: yup.string().required('Receiver address is required'),
  state: yup.string().required('Receiver state is required'),
  country: yup.string().required('Receiver country is required'),
  pinCode: yup.string().required('Receiver pin code is required'),
  gstNo: yup.string(),
  panNo: yup.string(),
  email: yup.string().email('Receiver Invalid email'),
  mobileNo: yup.string(),
})

// invoice item validation
export const itemInvInitalValues = {
  //   name: "",
  description: "",
  quantity: 0,
  gstRate: 12,
  rate: 0,
  gstAmt: 0,
  amt: 0,
  totalAmt: 0
}
export const itemInvValidationSchema = yup.object().shape({
  //   name: yup.string().required('Item name is required'),
  description: yup.string().required('Item description is required'),
  quantity: yup.number().required('Quantity is required'),
  gstRate: yup.number().required('GST rate is required'),
  rate: yup.number(),
  gstAmt: yup.number(),
  amt: yup.number().required('Amount is required'),
  totalAmt: yup.number(),
})

export const invNoInitalValues = {
 invoiceNo:"",
 _id:"",
 loading:false,
 show:false
}
export const invNoValidationSchema = yup.object().shape({
  invoiceNo: yup.string().required('Required'),
  _id: yup.string().required('Required'),
})