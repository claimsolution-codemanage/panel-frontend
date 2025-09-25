import * as yup from 'yup'

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

const approvalInitialValue = {
    approved: false,
    approvalDate: "",
    approvedAmount: "",
    approvalLetterPrivate: false,
    approvalLetter: ""
}

export const groInitialValues = {
    info: {
        specialCase: false,
        partnerFee: "",
        consultantFee: "",
        filingDate: "",
    },
    approval: approvalInitialValue,
    status: [],
    query: [],
    query_reply: [],
    isSettelment: false,
    ...paymentInitialValues
};

const attachmentSchema = yup.object().shape({
    url: yup.string().url("Invalid file URL").required("File URL is required"),
    fileName: yup.string().nullable(),
    fileType: yup.string().nullable(),
});

const paymentValidation = {
    // 🔹 settlement block (unchanged from before)
    paymentMode: yup.string().test(
        "Payment mode is required",
        "Payment mode is required",
        function (value) {
            const { isSettelment } = this.parent;
            return !isSettelment || (value && value.trim() !== "");
        }
    ),
    dateOfPayment: yup.date().test(
        "required-datepayment",
        "Date of payment is required",
        function (value) {
            const { isSettelment } = this.parent;
            return !isSettelment || value;
        }
    ),
    utrNumber: yup.string().test(
        "is-required-for-upi",
        "UTR Number is required for UPI",
        function (value) {
            const { paymentMode, isSettelment } = this.parent;
            return (
                !isSettelment ||
                paymentMode !== "UPI" ||
                (value && value.trim() !== "")
            );
        }
    ),
    bankName: yup.string().test(
        "is-required-for-bank-modes",
        "Bank Name is required",
        function (value) {
            const { paymentMode, isSettelment } = this.parent;
            return (
                !isSettelment ||
                !["Cheque", "Net Banking"].includes(paymentMode) ||
                (value && value.trim() !== "")
            );
        }
    ),
    chequeNumber: yup.string().test(
        "is-required-for-cheque",
        "Cheque Number is required",
        function (value) {
            const { paymentMode, isSettelment } = this.parent;
            return (
                !isSettelment ||
                paymentMode !== "Cheque" ||
                (value && value.trim() !== "")
            );
        }
    ),
    chequeDate: yup.date().test(
        "is-required-for-cheque",
        "Cheque Date is required",
        function (value) {
            const { paymentMode, isSettelment } = this.parent;
            return !isSettelment || paymentMode !== "Cheque" || !!value;
        }
    ).nullable(),
    amount: yup
        .number()
        .test("is-required-for-settlement", "Amount is required", function (value) {
            const { isSettelment } = this.parent;
            return !isSettelment || (value && !isNaN(value));
        })
        .typeError("Amount must be a number"),

    transactionDate: yup.date().test(
        "is-required-for-net-banking",
        "Transaction Date is required",
        function (value) {
            const { paymentMode, isSettelment } = this.parent;
            return !isSettelment || paymentMode !== "Net Banking" || !!value;
        }
    ).nullable(),
}

const statusValidation = yup.array().of(
    yup.object().shape({
        status: yup.string().required("Status is required"),
        remarks: yup.string(),
        date: yup.string().required("Date is required"),
        isPrivate: yup.boolean(),
        attachments: yup.array().of(attachmentSchema),
    })
)

const queryValidation = yup.array().of(
    yup.object().shape({
        remarks: yup.string().required("Required field"),
        date: yup.string().required("Date is required"),
        isPrivate: yup.boolean(),
        attachments: yup.array().of(attachmentSchema),
    })
)

const queryReplyValidation = yup.array().of(
    yup.object().shape({
        remarks: yup.string().required("Remarks is required"),
        date: yup.string().required("Date is required"),
        deliveredBy: yup.string().required("Delivered by is required"),
        isPrivate: yup.boolean(),
        attachments: yup.array().of(attachmentSchema),
    })
)

const approvalValidation = yup.object().shape({
    approved: yup.boolean(),
    approvalDate: yup.string().when("approved", {
        is: true,
        then: (schema) => schema.required("Approval date is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    approvedAmount: yup
        .number()
        .typeError("Approved amount must be a number")
        .when("approved", {
            is: true,
            then: (schema) =>
                schema.required("Approved amount is required").min(1, "Must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
        }),
    approvalLetterPrivate: yup.boolean(),
    // approvalLetter: yup.object().when("approved", {
    //   is: true,
    //   then: (schema) => schema.required("Approval letter is required"),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
})

const commonInFoValidation = {
    partnerFee: yup
        .number()
        .typeError("Must be number")
        .min(0, "Must be minimum 0")
        .test("partnerFee", "Partner fee is required", function (value) {
            const { isSettelment, specialCase } = this.parent;
            return (isSettelment || specialCase) ? value && !isNaN(value) : true;
        }),
    consultantFee: yup
        .number()
        .typeError("Must be number")
        .min(0, "Must be minimum 0")
        .test("consultantFee", "Consultant fee is required", function (value) {
            const { approved, specialCase } = this.parent;
            return (approved || specialCase) ? value && !isNaN(value) : true;
        }),
    filingDate: yup.string().required("Filing Date is required"),
}

const awardValidation = yup.array().of(
    yup.object().shape({
        awardType: yup.string().required("Award is required"),
        remarks: yup.string().required("Remarks is required"),
        date: yup.string().required("Date is required"),
        isPrivate: yup.boolean(),
        attachments: yup.array().of(attachmentSchema),
    })
)

export const groValidationSchema = yup.object().shape({
    // 🔹 info section
    info: yup.object().shape({
        specialCase: yup.boolean(),
        ...commonInFoValidation
    }),
    // 🔹 status section
    status: statusValidation,
    // 🔹 query section
    query: queryValidation,
    // 🔹 query_reply section
    query_reply: queryReplyValidation,
    // 🔹 approval section
    approval: approvalValidation,
    ...paymentValidation
});

// ombudsman start
export const ombudsmanInitialValues = {
    info: {
        specialCase: false,
        partnerFee: "",
        consultantFee: "",
        filingDate: "",
        method: "online",
        complaintNumber: "",
    },
    approval: approvalInitialValue,
    status: [],
    query: [],
    query_reply: [],
    hearing_schedule: [],
    award_part: [],
    isSettelment: false,
    ...paymentInitialValues
};

export const ombudsmanValidationSchema = yup.object().shape({
    // 🔹 info section
    info: yup.object().shape({
        complaintNumber: yup.string().required("Complaint number is required"),
        method: yup.string().required("Method is required"),
        ...commonInFoValidation
    }),
    // 🔹 status section
    status: statusValidation,
    // 🔹 query section
    query: queryValidation,
    // 🔹 query_reply section
    query_reply: queryReplyValidation,
    hearing_schedule: queryValidation,
    award_part: awardValidation,
    // 🔹 approval section
    approval: approvalValidation,
    ...paymentValidation,

});
// ombudsman end

// reimbursment start
export const reimbursmentInitialValues = {
    info: {
        specialCase: false,
        partnerFee: "",
        consultantFee: "",
        filingDate: "",
        method: "online",
        complaintNumber: "",
    },
    approval: approvalInitialValue,
    status: [],
    query: [],
    query_reply: [],
    track_stages: [],
    isSettelment: false,
    ...paymentInitialValues
};

export const reimbursmentValidationSchema = yup.object().shape({
    // 🔹 info section
    info: yup.object().shape({
        ...commonInFoValidation
    }),
    // 🔹 status section
    status: statusValidation,
    // 🔹 query section
    query: queryValidation,
    // 🔹 query_reply section
    query_reply: queryReplyValidation,
    track_stages: queryValidation,
    // 🔹 approval section
    approval: approvalValidation,
    ...paymentValidation,

});
// reimbursment end

// irdaiStage start
export const irdaiStageInitialValues = {
    info: {
        specialCase: false,
        partnerFee: "",
        consultantFee: "",
        filingDate: "",
        method: "online",
        complaintNumber: "",
    },
    approval: approvalInitialValue,
    status: [],
    query: [],
    query_reply: [],
    isSettelment: false,
    ...paymentInitialValues
};

export const irdaiStageValidationSchema = yup.object().shape({
    // 🔹 info section
    info: yup.object().shape({
        ...commonInFoValidation
    }),
    // 🔹 status section
    status: statusValidation,
    // 🔹 query section
    query: queryValidation,
    // 🔹 query_reply section
    query_reply: queryReplyValidation,
    // 🔹 approval section
    approval: approvalValidation,
    ...paymentValidation,

});
// irdaiStage end