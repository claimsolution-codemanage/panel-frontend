import React, { useEffect, useMemo, useState } from "react";
import { FORM_CONFIG } from "./formConfig"; // adjust import
import CaseFormModal from "./CaseFormModal";
import { CiEdit, CiLock } from "react-icons/ci";
import { getFormateDMYDate } from "../../../../utils/helperFunction";
import { FaPaperclip } from "react-icons/fa";
import { paymentInitialValues } from "../../../../utils/validation";
import AttachmentPreviewModal from "./AttachmentPreview";
import { Button } from "react-bootstrap";
import { Eye, Lock } from "lucide-react";
import { BiLock } from "react-icons/bi";

// 🔹 Main Component
const FormDetailViewer = ({
  caseId,
  formId,
  formType,
  onClose,
  caseFormDetailApi,
  createOrUpdateApi,
  attachementUpload,
  getCaseById,
  isCaseFormAccess,
}) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const previewInitialValue = { show: false, files: [], id: null, isMulti: true, readOnly: true }
  const [previewModal, setPreviewModal] = useState(previewInitialValue);


  const config = FORM_CONFIG?.[formType];

    const sectionToShow =
    config?.sections
      ?.map((ele) => ({
        ...ele,
        fields: ele?.fields?.filter((el) => el?.isView),
      }))
      ?.filter((ele) => ele?.isView && !["query_reply","query"]?.includes(ele?.key)) || [];

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await caseFormDetailApi({ formId, caseId });

      if (res?.data?.success && res?.data?.data) {
        let payload = { ...res.data.data };

        // Merge approval/info
        const singleFieldKeys = ["approval", "info"];
        singleFieldKeys.forEach((key) => {
          const defaults = config?.initialValue?.[key];
          if (!defaults) return;

          payload[key] = payload[key] || {};

          Object.keys(defaults).forEach((fieldKey) => {
            if (payload[fieldKey] !== undefined) {
              payload[key][fieldKey] = payload[fieldKey];
              delete payload[fieldKey];
            }
          });
        });

        // Flatten paymentDetailsId
        if (payload?.paymentDetailsId && typeof payload.paymentDetailsId === "object") {
          Object.keys(paymentInitialValues).forEach((fieldKey) => {
            if (payload?.paymentDetailsId[fieldKey]) {
              payload[fieldKey] = payload?.paymentDetailsId[fieldKey];
            }
          });
          delete payload.paymentDetailsId;
        }

        // Normalize settlement
        if (payload?.isSettelment) {
          payload.isSettelment = { isSettelment: true };
        }

        if(payload?.isPaymentStatement){
          payload.isPaymentStatement = { isPaymentStatement: true };

        }

        // Group sections by type
        if (Array.isArray(payload.sections)) {
          const grouped = payload.sections.reduce((acc, section) => {
            if (!acc[section.type]) acc[section.type] = [];
            acc[section.type].push(section);
            return acc;
          }, {});
          payload = { ...payload, ...grouped };
        }

        if (payload?.query || payload?.query_reply) {
          const queryArr = Array.isArray(payload.query) ? payload.query : [];
          const replyArr = Array.isArray(payload.query_reply) ? payload.query_reply : [];

          const combined = [
            ...queryArr.map((q) => ({ ...q, _type: "Query" })),
            ...replyArr.map((r) => ({ ...r, _type: "Reply" })),
          ];

          // Sort by date field (replace 'date' with your actual field name)
          combined.sort((a, b) => new Date(a.date) - new Date(b.date));

          payload.queryReply = combined;
        }
 
        if (payload?.approval) {
          payload.approval.approvalLetter = payload?.approval?.approvalLetter ? { url: payload?.approval?.approvalLetter } : null
        }

        setFormData(payload);
      }
    } catch (err) {
      console.error("❌ Error fetching form details:", err);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!caseId || !formId || !config) return;
    fetchData();
  }, [caseId, formId]);


if(!config) return(<></>)

return (
    <>
      {isCaseFormAccess && (
        <div className="d-flex justify-content-end p-2">
          <button
            className="d-flex gap-2 align-items-center btn btn-primary"
            onClick={() => setShowFormModal(true)}
          >
            <CiEdit size={18} />
            <span>{config?.btnText}</span>
          </button>
        </div>
      )}
       {!loading ? <>
      {formData ? sectionToShow?.map((item) => {
        const sectionData = formData[item?.key];
        if(!sectionData) return

        if (item?.key === "queryReply") {
          return (
            <QueryReplySection
              key={item?.key}
              item={item}
              data={sectionData}
              setPreviewModal={setPreviewModal}
            />
          );
        }

        if (Array.isArray(sectionData)) {
          return (
            <SectionTable
              key={item?.key}
              item={item}
              data={sectionData}
              setPreviewModal={setPreviewModal}
            />
          );
        } else if (typeof sectionData === "object") {
          return (
            <ObjectSection
              key={item?.key}
              item={item}
              data={sectionData}
              setPreviewModal={setPreviewModal}
            />
          );
        } else {
          return (
            <div
              key={item?.key}
              className="alert alert-light text-center my-3 shadow-sm rounded"
            >
              No records found
            </div>
          );
        }
      }):""}
       </>:<></>}
       
      <CaseFormModal
        formType={formType}
        caseId={caseId}
        show={showFormModal}
        close={() => setShowFormModal(false)}
        getCaseById={getCaseById}
        formData={formData}
        createOrUpdateApi={createOrUpdateApi}
        attachementUpload={attachementUpload}
      />
      <AttachmentPreviewModal show={previewModal?.show} files={previewModal?.files} isMulti={previewModal?.isMulti} readOnly={previewInitialValue.readOnly} onDelete={(newValue) => { }} onClose={() => setPreviewModal(previewInitialValue)} />

    </>
  );
};

export default FormDetailViewer;


// 🔹 Render a single field value
function FieldValue({ field, value, setPreviewModal }) {
  if (!value) return <span>-</span>;

  let displayValue = value;

  if (field?.type === "date") {
    displayValue = getFormateDMYDate(value);
  } else if (typeof value === "string") {
    displayValue = value;
  } else if (field?.type === "file") {
    displayValue = <div><Button
      className="btn-primary"
      variant="outline"
      size="sm"
      onClick={() => setPreviewModal({ show: true, files: Array.isArray(value) ? value : (typeof value === "object" ? [value] : []), isMulti: true, readOnly: true })}
    >
      <>
        <Eye className="w-4 h-4 mr-1" /> View
      </>

    </Button></div>
  } else if (typeof value === "boolean") {
    displayValue = value ? "✅" : "❎"
  } else if (typeof value === "object") {
    displayValue = JSON.stringify(value, null, 2);
  }

  return (
    <span className="text-truncate" title={displayValue}>
      {displayValue}
    </span>
  );
};

// 🔹 Table cell for list sections
function FieldCell({ field, value, setPreviewModal }) {
  if (!value) return <td>-</td>;

  let displayValue = value;
  if (field?.type === "date") {
    displayValue = getFormateDMYDate(value);
  } else if (field?.type === "file" && Array.isArray(displayValue)) {
    displayValue = <div><Button
      className="btn-primary"
      variant="outline"
      size="sm"
      onClick={() => setPreviewModal({ show: true, files: value, isMulti: true, readOnly: true })}
    >
      <>
        <Eye className="w-4 h-4 mr-1" /> View
      </>

    </Button></div>
  } else if (typeof value === "string") {
    displayValue = value;
  } else {
    displayValue = ""
  }

  return (
    <td className="text-nowrap">
      <p className="mb-1 text-truncate">
        {displayValue}
      </p>
    </td>
  );
};

// 🔹 Object Section Renderer (non-list)
function ObjectSection({ item, data, setPreviewModal }) {
  if (!data || !Object.values(data).length) {
    return (
      <div className="alert alert-light text-center my-3 shadow-sm rounded">
        No records found
      </div>
    );
  }

  return (
    <div className="card-body overflow-auto">
      <div className="mt-4 rounded-2 shadow">
        <span className="d-flex align-items-center justify-content-center my-2 text-primary fs-5 fw-bold">
          {item.label}
        </span>

        <div className="table-responsive">
          <table className="table table-borderless align-middle">
            <tbody>
              {item?.fields?.map((field) => {
                if (!data?.[field?.name]) return <tr></tr>
                return <tr key={field?.name}>
                  <th className="text-nowrap text-secondary">{field?.label}</th>
                  <td>
                    <FieldValue field={field} value={data?.[field?.name]} setPreviewModal={setPreviewModal} />
                  </td>
                </tr>
              })}
              {/* Attachments for object section */}
              {Array.isArray(data?.attachments) && (
                <tr>
                  <th>Attachments</th>
                  <td>
                    {data.attachments.length ? (
                      <div className="d-flex gap-2">
                        {data.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary rounded-circle"
                            title={file.fileName}
                          >
                            <FaPaperclip />
                          </a>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 🔹 List Section Renderer
function SectionTable({ item, data, setPreviewModal }) {
  if (!Array.isArray(data) || !data.length) {
    return (
      <div className="alert alert-light text-center my-3 shadow-sm rounded">
        No records found
      </div>
    );
  }

  return (
    <div className="card-body overflow-auto">
      <div className="mt-4 rounded-2 shadow">
        <span className="d-flex align-items-center justify-content-center my-2 text-primary fs-5 fw-bold">
          {item.label}
        </span>

        <div className="table-responsive">
          <table className="table table-hover table-borderless align-middle">
            <thead>
              <tr className="bg-primary text-white text-center">
                <th className="text-nowrap">S.no</th>
                {item?.fields?.map((field) => (
                  <th key={field?.name} className="text-nowrap">
                    {field?.label || field.placeholder}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((el, ind) => (
                <tr key={el._id || ind} className="border-bottom text-center">
                  <td>{ind + 1} {el?.isPrivate ? <CiLock/> :""}</td>
                  {item?.fields?.map((field) => (
                    <FieldCell
                      key={field?.name}
                      field={field}
                      value={el?.[field?.name]}
                      setPreviewModal={setPreviewModal}
                    />
                  ))}
                  {/* <td>
                    {el?.attachments?.length ? (
                      <div className="d-flex gap-2 justify-content-center">
                        {el.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary rounded-circle"
                            title={file.fileName}
                          >
                            <FaPaperclip />
                          </a>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function QueryReplySection({ item, data, setPreviewModal }) {
  if (!Array.isArray(data) || !data.length) {
    return (
      <div className="alert alert-light text-center my-3 shadow-sm rounded">
        No queries/replies found
      </div>
    );
  }

  return (
    <div className="card-body overflow-auto">
      <div className="mt-4 rounded-2 shadow">
        <span className="d-flex align-items-center justify-content-center my-2 text-primary fs-5 fw-bold">
          {item.label || "Query & Reply"}
        </span>

        <div className="table-responsive">
          <table className="table table-hover table-borderless align-middle">
            <thead>
              <tr className="bg-primary text-white text-center">
                <th className="text-nowrap">S.no</th>
                <th className="text-nowrap">Type</th>
                {item?.fields?.map((field) => (
                  <th key={field?.name} className="text-nowrap">
                    {field?.label || field.placeholder}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((el, ind) => (
                <tr key={el._id || ind} className="border-bottom text-center">
                  <td>{ind + 1} {el?.isPrivate ? <CiLock/> :""}</td>
                  <td>
                    <span
                      className={
                        el._type === "Query" ? "text-primary fw-bold" : "text-success fw-bold"
                      }
                    >
                      {el._type}
                    </span>
                  </td>
                  {item?.fields?.map((field) => (
                    <FieldCell
                      key={field?.name}
                      field={field}
                      value={el?.[field?.name]}
                      setPreviewModal={setPreviewModal}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
