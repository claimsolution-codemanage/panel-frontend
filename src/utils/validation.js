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


export const groInitialValues = {
  specialCase:false,
  partnerConsultantFee:"",
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
  approvalLetter:""
};

export const groValidationSchema = yup.object().shape({
  partnerFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "partnerFee",
    "Partner fee is required",
    function (value) {
      const { isSettelment } = this.parent;
      return !isSettelment || (value && !isNaN(value));
    }),
  consultantFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "consultantFee",
    "Consultant fee is required",
    function (value) {
      const { approved } = this.parent;
      return !approved || (value && !isNaN(value));
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
      return approved && value > 0;
    }),
  approvalDate: yup.string().test(
    "approved",
    "Approved date is required",
    function (value) {
      const { approved } = this.parent;
      return approved && value;
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
  partnerConsultantFee:"",
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
  approvalLetter:""
};

export const ombudsmanValidationSchema = yup.object().shape({
  partnerFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "partnerFee",
    "Partner fee is required",
    function (value) {
      const { isSettelment } = this.parent;
      return !isSettelment || (value && !isNaN(value));
    }),
  consultantFee:yup.number().typeError("Must be number").min(0,"Must be minimum 0").test(
    "consultantFee",
    "Consultant fee is required",
    function (value) {
      const { approved } = this.parent;
      return !approved || (value && !isNaN(value));
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
      return approved && value > 0;
    }),
  approvalDate: yup.string().test(
    "approved",
    "Approved date is required",
    function (value) {
      const { approved } = this.parent;
      return approved && value;
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