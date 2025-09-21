import { groInitialValues, groValidationSchema, ombudsmanInitialValues, reimbursmentInitialValues, reimbursmentValidationSchema } from "../../../../utils/validations/case/form/caseFormValidation";

export const FORM_CONFIG = {
  gro: {
    title: "GRO Form",
    btnText: "GRO Details",
    initialValue: groInitialValues,
    validationSchema: groValidationSchema,
    sections: [
      {
        key: "info",
        label: "Info",
        type: "single",
        isView: true,
        fields: [
          { name: "specialCase", type: "checkbox", label: "Special Case", isView: true },
          { name: "partnerFee", type: "text", placeholder: "fee (%)", label: "Partner Fee (%)", isView: true },
          { name: "consultantFee", type: "text", placeholder: "fee (%)", label: "Consultant Fee (%)", isView: true },
          { name: "filingDate", type: "date", label: "GRO Filing Date", isView: true },
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "list",
        isView: true,
        fields: [
          { name: "status", type: "text", label: "Status", placeholder: "Status", isView: true },
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query",
        label: "Query",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query_reply",
        label: "Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "queryReply",
        label: "Query & Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      // … queryReply, approval, settlement
      {
        key: "approval",
        label: "Approval",
        type: "single", // single object, not list
        isView: true,
        isColumn: false,
        fields: [
          { name: "approved", type: "checkbox", label: "Approved", isView: false },
          { name: "approvalDate", type: "date", label: "Approval Date", showIf: "approved", isView: true },
          { name: "approvedAmount", type: "text", label: "Approval Amount", placeholder: "Approved Amount", showIf: "approved", isView: true },
          { name: "approvalLetterPrivate", type: "checkbox", label: "Private", showIf: "approved", isView: false },
          { name: "approvalLetter", type: "file", label: "Approval Letter", showIf: "approved", isView: true },
        ],
      },
      {
        key: "isSettelment",
        label: "Settlement Details",
        type: "single",
        isView: false,
        isColumn: true,
        fields: [
          { name: "isSettelment", type: "checkbox", label: "Settlement" },
          { name: "paymentDetails", type: "custom", component: "PaymentDetails", showIf: "isSettelment" },
        ],
      },

    ],
  },
  ombudsman: {
    title: "Ombudsman Form",
    btnText: "Ombudsman Details",
    initialValue: ombudsmanInitialValues,
    validationSchema: ombudsmanInitialValues,
    sections: [
      {
        key: "info",
        label: "Info",
        type: "single",
        isView: true,
        fields: [
          { name: "method", type: "select", label: "Method", placeholder: "select method", isView: true, options: [{ label: "Online", value: "online" }, { label: "Offline", value: "offline" }] },
          { name: "partnerFee", type: "text", placeholder: "fee (%)", label: "Partner Fee (%)", isView: true },
          { name: "consultantFee", type: "text", placeholder: "fee (%)", label: "Consultant Fee (%)", isView: true },
          { name: "filingDate", type: "date", label: "Ombudsman Filing Date", isView: true },
          { name: "complaintNumber", type: "text", placeholder: "complaint no.", label: "Complaint Number", isView: true },
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "list",
        isView: true,
        fields: [
          { name: "status", type: "text", label: "Status", placeholder: "Status", isView: true },
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query",
        label: "Query",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query_reply",
        label: "Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "queryReply",
        label: "Query & Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "hearing_schedule",
        label: "Hearing schedule",
        type: "list",
        isView: true,
        fields: [
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "award_part",
        label: "Award Part",
        type: "list",
        isView: true,
        fields: [
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "awardType", type: "select", label: "Award type", placeholder: "select award type", isView: true, options: [{ label: "Award", value: "award" }, { label: "Reject", value: "reject" }] },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "approval",
        label: "Approval",
        type: "single", // single object, not list
        isView: true,
        isColumn: false,
        fields: [
          { name: "approved", type: "checkbox", label: "Approved", isView: false },
          { name: "approvalDate", type: "date", label: "Approval Date", showIf: "approved", isView: true },
          { name: "approvedAmount", type: "text", label: "Approval Amount", placeholder: "Approved Amount", showIf: "approved", isView: true },
          { name: "approvalLetterPrivate", type: "checkbox", label: "Private", showIf: "approved", isView: false },
          { name: "approvalLetter", type: "file", label: "Approval Letter", showIf: "approved", isView: true },
        ],
      },
      {
        key: "isSettelment",
        label: "Settlement Details",
        type: "single",
        isView: false,
        isColumn: true,
        fields: [
          { name: "isSettelment", type: "checkbox", label: "Settlement" },
          { name: "paymentDetails", type: "custom", component: "PaymentDetails", showIf: "isSettelment" },
        ],
      },

    ],
  },
  reimbursment_claim_filing: {
    title: "Reimbursment Claim Filing Form",
    btnText: "Reimbursment claim filing",
    initialValue: reimbursmentInitialValues,
    validationSchema: reimbursmentValidationSchema,
    sections: [
      {
        key: "info",
        label: "Info",
        type: "single",
        isView: true,
        fields: [
          { name: "specialCase", type: "checkbox", label: "Special Case", isView: true },
          { name: "partnerFee", type: "text", placeholder: "fee (%)", label: "Partner Fee (%)", isView: true },
          { name: "consultantFee", type: "text", placeholder: "fee (%)", label: "Consultant Fee (%)", isView: true },
          { name: "filingDate", type: "date", label: "GRO Filing Date", isView: true },
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "list",
        isView: true,
        fields: [
          { name: "status", type: "text", label: "Status", placeholder: "Status", isView: true },
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query",
        label: "Query",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query_reply",
        label: "Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "queryReply",
        label: "Query & Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "track_stages",
        label: "Track Stages",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Stage", placeholder: "Stage", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      // … queryReply, approval, settlement
      {
        key: "approval",
        label: "Approval",
        type: "single", // single object, not list
        isView: true,
        isColumn: false,
        fields: [
          { name: "approved", type: "checkbox", label: "Approved", isView: false },
          { name: "approvalDate", type: "date", label: "Approval Date", showIf: "approved", isView: true },
          { name: "approvedAmount", type: "text", label: "Approval Amount", placeholder: "Approved Amount", showIf: "approved", isView: true },
          { name: "approvalLetterPrivate", type: "checkbox", label: "Private", showIf: "approved", isView: false },
          { name: "approvalLetter", type: "file", label: "Approval Letter", showIf: "approved", isView: true },
        ],
      },
      {
        key: "isSettelment",
        label: "Settlement Details",
        type: "single",
        isView: false,
        isColumn: true,
        fields: [
          { name: "isSettelment", type: "checkbox", label: "Settlement" },
          { name: "paymentDetails", type: "custom", component: "PaymentDetails", showIf: "isSettelment" },
        ],
      },

    ],
  },
  irdai_stage: {
    title: "IRDAI stage Form",
    btnText: "IRDAI stage",
    initialValue: reimbursmentInitialValues,
    validationSchema: reimbursmentValidationSchema,
    sections: [
      {
        key: "info",
        label: "Info",
        type: "single",
        isView: true,
        fields: [
          { name: "specialCase", type: "checkbox", label: "Special Case", isView: true },
          { name: "partnerFee", type: "text", placeholder: "fee (%)", label: "Partner Fee (%)", isView: true },
          { name: "consultantFee", type: "text", placeholder: "fee (%)", label: "Consultant Fee (%)", isView: true },
          { name: "filingDate", type: "date", label: "GRO Filing Date", isView: true },
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "list",
        isView: true,
        fields: [
          { name: "status", type: "text", label: "Status", placeholder: "Status", isView: true },
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query",
        label: "Query",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "query_reply",
        label: "Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "isPrivate", type: "checkbox", label: "Private", isView: false },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      {
        key: "queryReply",
        label: "Query & Reply",
        type: "list",
        isView: true,
        fields: [
          { name: "remarks", type: "text", label: "Remarks", placeholder: "Remarks", isView: true },
          { name: "date", type: "date", label: "Date", isView: true },
          { name: "deliveredBy", type: "select", label: "Delivered by", placeholder: "select delivered by", isView: true, options: [{ label: "Mail", value: "mail" }, { label: "Courier", value: "courier" }] },
          { name: "attachments", type: "file", label: "Attachments", multiple: true, isView: true },
        ],
      },
      // … queryReply, approval, settlement
      {
        key: "approval",
        label: "Approval",
        type: "single", // single object, not list
        isView: true,
        isColumn: false,
        fields: [
          { name: "approved", type: "checkbox", label: "Approved", isView: false },
          { name: "approvalDate", type: "date", label: "Approval Date", showIf: "approved", isView: true },
          { name: "approvedAmount", type: "text", label: "Approval Amount", placeholder: "Approved Amount", showIf: "approved", isView: true },
          { name: "approvalLetterPrivate", type: "checkbox", label: "Private", showIf: "approved", isView: false },
          { name: "approvalLetter", type: "file", label: "Approval Letter", showIf: "approved", isView: true },
        ],
      },
      {
        key: "isSettelment",
        label: "Settlement Details",
        type: "single",
        isView: false,
        isColumn: true,
        fields: [
          { name: "isSettelment", type: "checkbox", label: "Settlement" },
          { name: "paymentDetails", type: "custom", component: "PaymentDetails", showIf: "isSettelment" },
        ],
      },

    ],
  },
};
